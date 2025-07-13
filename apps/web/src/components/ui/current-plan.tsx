import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { CheckCircle, Crown } from 'lucide-react'

interface CurrentPlanProps {
  plan: {
    id: string
    name: string | { en: string, pt: string, es: string }
    price: number | { value?: number, amount?: number }
    features: string[] | { en: string[], pt: string[], es: string[] }
    type: 'FREE' | 'PRO' | 'PREMIUM'
  }
}

export function CurrentPlan({ plan }: CurrentPlanProps) {
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'FREE':
        return 'bg-gray-100 text-gray-800'
      case 'PRO':
        return 'bg-blue-100 text-blue-800'
      case 'PREMIUM':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInterval = (type: string) => {
    return type === 'FREE' ? 'gratuito' : 'mês'
  }

  // Função para obter o preço correto
  const getPlanPrice = () => {
    if (typeof plan.price === 'number') {
      return plan.price
    }
    // Se price for um objeto, tentar extrair um valor numérico
    if (typeof plan.price === 'object' && plan.price !== null) {
      return plan.price.value || plan.price.amount || 0
    }
    return 0
  }

  // Função para obter o nome no idioma correto
  const getPlanName = () => {
    if (typeof plan.name === 'string') {
      return plan.name
    }
    // Se name for um objeto com idiomas, usar inglês como padrão
    if (typeof plan.name === 'object' && plan.name !== null) {
      return plan.name.en || plan.name.pt || plan.name.es || plan.type
    }
    return plan.type
  }

  // Função para obter as features no formato correto
  const getFeatures = () => {
    if (Array.isArray(plan.features)) {
      return plan.features
    }
    // Se features for um objeto com idiomas, usar inglês como padrão
    if (typeof plan.features === 'object' && plan.features !== null) {
      return plan.features.en || plan.features.pt || plan.features.es || []
    }
    return []
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{getPlanName()}</CardTitle>
          </div>
          <Badge className={getStatusColor(plan.type)}>
            {plan.type}
          </Badge>
        </div>
        <CardDescription>
          Seu plano atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${getPlanPrice()}
            <span className="text-sm font-normal text-gray-500">
              /{getInterval(plan.type)}
            </span>
          </span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Recursos inclusos:</h4>
          <ul className="space-y-1">
            {getFeatures().map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 