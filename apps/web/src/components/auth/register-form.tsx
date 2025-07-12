'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'

interface RegisterFormProps {
  onToggleMode?: () => void
}

const floridaCities = [
  'Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 
  'St. Petersburg', 'Tallahassee', 'Hialeah', 'Port St. Lucie', 
  'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Gainesville',
  'Coral Springs', 'Clearwater', 'Miami Beach', 'Plantation',
  'West Palm Beach', 'Lakeland', 'Davie'
]

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading, error } = useAuthStore()

  // Schema de validação
  const registerSchema = z.object({
    name: z.string().min(2, t('nameRequired')),
    email: z.string().email(t('invalidEmail')).min(1, t('emailRequired')),
    password: z.string().min(6, t('passwordMinLength')),
    confirmPassword: z.string(),
    phone: z.string().min(10, t('phoneRequired')),
    userType: z.enum(['client', 'provider'], {
      required_error: t('userTypeRequired') || 'Selecione o tipo de usuário'
    }),
    city: z.string().min(2, t('cityRequired')),
    terms: z.boolean().refine(val => val === true, t('termsRequired') || 'Você deve aceitar os termos de uso')
  }).refine(data => data.password === data.confirmPassword, {
    message: t('passwordMismatch'),
    path: ["confirmPassword"]
  })

  type RegisterFormData = z.infer<typeof registerSchema>

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('🔄 Tentando registrar usuário:', {
        email: data.email,
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || '',
        phone: data.phone,
        role: data.userType.toUpperCase(),
      })
      
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || '',
        phone: data.phone,
        role: data.userType.toUpperCase() as 'CLIENT' | 'PROVIDER',
      })
      
      console.log('✅ Usuário registrado com sucesso!')
      toast.success(t('registerSuccess') || 'Conta criada com sucesso!')
      // Redirect será feito pelo middleware ou pela aplicação
    } catch (error: any) {
      console.error('❌ Erro ao registrar usuário:', error)
      console.error('❌ Detalhes do erro:', error.response?.data || error.message)
      toast.error(error.message || t('registerError') || 'Erro ao criar conta')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t('joinFixelo')}
          </CardTitle>
          <CardDescription>
            {t('createAccount')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                {t('name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  placeholder={t('name')}
                  className="pl-10"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                {t('phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(305) 123-4567"
                  className="pl-10"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Tipo de usuário */}
            <div className="space-y-2">
              <label htmlFor="userType" className="text-sm font-medium text-gray-700">
                {t('userType')}
              </label>
              <Select onValueChange={(value) => setValue('userType', value as 'client' | 'provider')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('userType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">
                    <div className="flex flex-col">
                      <span>{t('client')}</span>
                      <span className="text-xs text-gray-500">{t('clientDescription') || 'Buscar serviços'}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="provider">
                    <div className="flex flex-col">
                      <span>{t('provider')}</span>
                      <span className="text-xs text-gray-500">{t('providerDescription') || 'Oferecer serviços'}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && (
                <p className="text-sm text-red-500">{errors.userType.message}</p>
              )}
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">
                {t('city')}
              </label>
              <Select onValueChange={(value) => setValue('city', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('city')} />
                </SelectTrigger>
                <SelectContent>
                  {floridaCities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password')}
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirmPassword')}
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Termos de uso */}
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...register('terms')}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                {t('termsAgreement') || 'Aceito os termos de uso e política de privacidade'}
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </>
              ) : (
                t('register')
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('hasAccount')}{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('signInNow')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 