'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

type AuthMode = 'login' | 'register' | 'forgot-password'

export default function AuthPage() {
  const t = useTranslations('auth')
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>('login')

  useEffect(() => {
    const modeParam = searchParams.get('mode') as AuthMode
    if (modeParam && ['login', 'register', 'forgot-password'].includes(modeParam)) {
      setMode(modeParam)
    }
  }, [searchParams])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          key={mode}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {mode === 'login' && t('welcomeBack')}
              {mode === 'register' && t('joinFixelo')}
              {mode === 'forgot-password' && t('resetPassword')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login' && t('signInToAccount')}
              {mode === 'register' && t('createAccount')}
              {mode === 'forgot-password' && t('enterEmailToReset')}
            </p>
          </div>

          <div className="mt-8">
            {mode === 'login' && (
              <LoginForm 
                onToggleMode={() => setMode('register')} 
                onForgotPassword={() => setMode('forgot-password')}
              />
            )}
            {mode === 'register' && (
              <RegisterForm 
                onToggleMode={() => setMode('login')} 
              />
            )}
            {mode === 'forgot-password' && (
              <ForgotPasswordForm 
                onBack={() => setMode('login')}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 