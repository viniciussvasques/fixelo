import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { CheckCircle, Crown } from 'lucide-react'

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

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      // Aqui seria feita a chamada para a API de upgrade
      console.log(`Upgrading to ${planType}`)
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock plans data
  const plans: Plan[] = [
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'monthly',
      features: [
        'Priority listing',
        'Unlimited leads',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 59,
      interval: 'monthly',
      features: [
        'Top listing',
        'Unlimited everything',
        'Dedicated manager',
        'Custom integrations',
        'White label'
      ],
      recommended: true
    }
  ]

  const selectedPlan = plans.find(p => p.id.toLowerCase() === planType.toLowerCase())

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
                {isLoading ? 'Processando...' : `Upgrade para ${planType}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 