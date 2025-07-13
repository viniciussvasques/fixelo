import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { CheckCircle, Crown } from 'lucide-react'

interface CurrentPlanProps {
  plan: {
    id: string
    name: string
    price: number
    features: string[]
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

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{plan.name}</CardTitle>
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
            ${plan.price}
            <span className="text-sm font-normal text-gray-500">
              /{getInterval(plan.type)}
            </span>
          </span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Recursos inclusos:</h4>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
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