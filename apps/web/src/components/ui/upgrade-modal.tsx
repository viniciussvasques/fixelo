import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { CheckCircle, Crown } from 'lucide-react'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
  recommended?: boolean
}

interface UpgradeModalProps {
  planType: string
  currentPlan: string
  children: React.ReactNode
}

export function UpgradeModal({ planType, currentPlan, children }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      // Chama endpoint que retorna a URL do Stripe Checkout
      const res = await api.post('/plans/checkout-session', { billingPeriod: 'monthly' })
      console.log('Checkout response:', res.data) // Debug log
      if (res.data?.data?.url) {
        window.location.href = res.data.data.url
        return
      }
      alert('Erro ao criar sessão de pagamento. Tente novamente.')
    } catch (error) {
      alert('Erro ao iniciar upgrade. Tente novamente.')
      console.error('Erro ao criar sessão Stripe:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar mock dos planos para refletir Free e Pro corretamente
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Grátis',
      price: 0,
      interval: 'monthly',
      features: [
        'Listagem básica de serviço',
        'Até 10 leads por mês',
        'Suporte básico',
        'Analytics básico'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'monthly',
      features: [
        'Listagem prioritária',
        'Até 40 leads por mês',
        'Analytics avançado',
        'Suporte prioritário'
      ],
      popular: true
    }
  ]

  // Fallback seguro para planType
  const safePlanType = planType ? planType.toLowerCase() : 'pro';
  const selectedPlan = plans.find(p => p.id.toLowerCase() === safePlanType);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrade para {planType}</DialogTitle>
          <DialogDescription>
            Aproveite todos os recursos do plano {planType}
          </DialogDescription>
        </DialogHeader>
        
        {selectedPlan && (
          <div className="space-y-6">
            <Card className="border-blue-500">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-xl">{selectedPlan.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold">
                  ${selectedPlan.price}
                  <span className="text-sm font-normal text-gray-500">
                    /{selectedPlan.interval === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3">
              <DialogTrigger asChild>
                <Button variant="outline">
                  Cancelar
                </Button>
              </DialogTrigger>
              <Button 
                onClick={handleUpgrade}
                disabled={isLoading || planType === currentPlan}
                className="min-w-[120px]"
              >
                {isLoading ? 'Processando...' : `Upgrade para ${selectedPlan?.name || 'Pro'}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 