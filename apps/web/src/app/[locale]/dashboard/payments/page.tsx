'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { CreditCard, Plus, Download, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PaymentsPage() {
  const t = useTranslations('dashboard.payments')

  // Mock data - replace with real API call
  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expMonth: 6,
      expYear: 2026,
      isDefault: false
    }
  ]

  const transactions = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'House Cleaning Service',
      amount: 120.00,
      status: 'completed',
      receipt: 'receipt_1.pdf'
    },
    {
      id: '2',
      date: '2024-01-10',
      description: 'Plumbing Repair',
      amount: 95.50,
      status: 'completed',
      receipt: 'receipt_2.pdf'
    },
    {
      id: '3',
      date: '2024-01-05',
      description: 'Electrical Installation',
      amount: 250.00,
      status: 'pending',
      receipt: null
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('paymentMethods.title')}</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t('paymentMethods.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getBrandIcon(method.brand)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        •••• •••• •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary">{t('paymentMethods.default')}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {t('paymentMethods.expires')} {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    {t('paymentMethods.edit')}
                  </Button>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      {t('paymentMethods.delete')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('transactions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {t(`transactions.status.${transaction.status}`)}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('transactions.view')}
                    </Button>
                    {transaction.receipt && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        {t('transactions.download')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 