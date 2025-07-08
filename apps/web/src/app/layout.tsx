import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Fixelo - Your Service Marketplace in Florida',
    template: '%s | Fixelo'
  },
  description: 'Find, book, and pay verified professionals for services like cleaning, repairs, beauty, and more in Florida. Real-time chat, reviews, and secure payments.',
  keywords: [
    'services',
    'marketplace',
    'florida',
    'cleaning',
    'repairs',
    'beauty',
    'professionals',
    'booking',
    'payments'
  ],
  authors: [{ name: 'Fixelo Team' }],
  creator: 'Fixelo',
  publisher: 'Fixelo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Fixelo - Your Service Marketplace in Florida',
    description: 'Find, book, and pay verified professionals for services like cleaning, repairs, beauty, and more in Florida.',
    siteName: 'Fixelo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fixelo - Service Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixelo - Your Service Marketplace in Florida',
    description: 'Find, book, and pay verified professionals for services like cleaning, repairs, beauty, and more in Florida.',
    images: ['/og-image.png'],
    creator: '@fixelo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 