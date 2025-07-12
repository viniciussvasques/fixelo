import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fixelo - Professional Services Marketplace',
  description: 'Find and book professional services in Florida. From cleaning to repairs, beauty to pet care.',
  keywords: ['services', 'florida', 'professionals', 'booking', 'marketplace'],
  authors: [{ name: 'Fixelo Team' }],
  creator: 'Fixelo',
  publisher: 'Fixelo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fixelo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'pt-BR': '/pt',
      'es-ES': '/es',
    },
  },
  openGraph: {
    title: 'Fixelo - Professional Services Marketplace',
    description: 'Find and book professional services in Florida',
    url: 'https://fixelo.com',
    siteName: 'Fixelo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fixelo - Professional Services Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixelo - Professional Services Marketplace',
    description: 'Find and book professional services in Florida',
    creator: '@fixelo',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 