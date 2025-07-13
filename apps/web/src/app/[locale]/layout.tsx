import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import HeaderFooterWrapper from '@/components/layout/header-footer-wrapper'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }, { locale: 'es' }]
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages: any
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
    </NextIntlClientProvider>
  )
}
