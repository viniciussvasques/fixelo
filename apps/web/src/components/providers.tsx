'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { ReactQueryProvider } from '@/lib/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
} 