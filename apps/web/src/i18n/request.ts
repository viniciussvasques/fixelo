import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Fallback para 'en' se locale for undefined
  const validLocale = locale && locales.includes(locale as Locale) ? locale : 'en';
  
  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  };
}); 