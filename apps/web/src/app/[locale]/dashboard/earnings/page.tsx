import { usePlans } from '@/hooks/use-plans'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function EarningsPage() {
  const t = useTranslations('Earnings')
  const router = useRouter()
  const locale = router.locale || 'en'

  const { currentPlan, isLoading: planLoading } = usePlans()
  const isPro = currentPlan?.type === 'PRO'

  if (!isPro && !planLoading) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-yellow-50 border border-yellow-300 rounded-xl text-center shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{t('subscriptionPage.upgradeBanner')}</h2>
        <p className="mb-4 text-yellow-800">{t('subscriptionPage.pro.features.0')}</p>
        <Button className="bg-amber-500 text-white font-bold hover:bg-amber-600" onClick={() => router.push(`/${locale}/dashboard/subscription`)}>
          {t('subscriptionPage.pro.cta')}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1>{t('earningsPage.title')}</h1>
      <p>{t('earningsPage.description')}</p>
      {/* Add more content for earnings here */}
    </div>
  )
} 