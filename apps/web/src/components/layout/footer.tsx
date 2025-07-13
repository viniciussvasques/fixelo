'use client'

import { useTranslations } from 'next-intl'

export function Footer() {
  try {
    const t = useTranslations('footer')
    
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Fixelo</div>
              <p className="text-gray-400">{t('tagline')}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('services.title')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('services.cleaning')}</a></li>
                <li><a href="#" className="hover:text-white">{t('services.repairs')}</a></li>
                <li><a href="#" className="hover:text-white">{t('services.beauty')}</a></li>
                <li><a href="#" className="hover:text-white">{t('services.personalCare')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('company.title')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('company.about')}</a></li>
                <li><a href="#" className="hover:text-white">{t('company.contact')}</a></li>
                <li><a href="#" className="hover:text-white">{t('company.careers')}</a></li>
                <li><a href="#" className="hover:text-white">{t('company.blog')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('support.title')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('support.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white">{t('support.terms')}</a></li>
                <li><a href="#" className="hover:text-white">{t('support.privacy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('support.safety')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    console.error('Error in Footer component:', error);
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Footer loading...</p>
        </div>
      </footer>
    )
  }
} 