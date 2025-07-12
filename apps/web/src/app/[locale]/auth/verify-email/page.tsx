'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Token de verificação não encontrado')
        return
      }

      try {
        await apiClient.verifyEmail(token)
        setStatus('success')
        setMessage('Email verificado com sucesso!')
        toast.success('Email verificado! Você pode fazer login agora.')
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push(`/${locale}/auth`)
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'Erro ao verificar email')
        toast.error('Erro ao verificar email')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const handleResendVerification = async () => {
    try {
      const email = searchParams.get('email')
      if (!email) {
        toast.error('Email não encontrado')
        return
      }

      await apiClient.resendVerification(email)
      toast.success('Email de verificação reenviado!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reenviar email')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verificando email...'}
              {status === 'success' && 'Email verificado!'}
              {status === 'error' && 'Erro na verificação'}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {status === 'success' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Sua conta foi verificada com sucesso! Você será redirecionado para o login em alguns segundos.
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/${locale}/auth`)}
                  className="w-full"
                >
                  Ir para o login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    {message}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar verificação
                  </Button>
                  
                  <Button
                    onClick={() => router.push(`/${locale}/auth`)}
                    className="w-full"
                  >
                    Voltar para login
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    Aguarde enquanto verificamos seu email...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 