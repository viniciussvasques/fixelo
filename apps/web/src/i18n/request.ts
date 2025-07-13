import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Validate locale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }
  
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    // Validate that messages object exists and has required structure
    if (!messages || typeof messages !== 'object') {
      console.error(`Invalid messages structure for locale: ${locale}`);
      throw new Error(`Invalid messages structure for locale: ${locale}`);
    }
    
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // Fallback to English if loading fails
    const fallbackMessages = (await import(`../../messages/en.json`)).default;
    return {
      locale: 'en',
      messages: fallbackMessages
    };
  }
}); 