// All runtime settings come from .env (see .env.example). Defaults keep the app working without one.
const env = import.meta.env;

export const config = {
  companyName: env.VITE_COMPANY_NAME || 'Elite Jinzai Marketing Services Inc.',
  companyShortName: env.VITE_COMPANY_SHORT_NAME || 'Elite Jinzai',
  companyAddress:
    env.VITE_COMPANY_ADDRESS ||
    'Unit 4F Cypress Garden Bldg., 112 V.A. Rufino St., Legaspi Village, Makati City 1223',
  // Address shown when the site is in Japanese.
  companyAddressJa:
    env.VITE_COMPANY_ADDRESS_JA ||
    'マカティ市 レガスピ・ビレッジ V.A.ルフィノ通り112 サイプレス・ガーデン・ビル 4階（〒1223）',
  // Comma-separated phone numbers and the recruitment Facebook page (from elitejinzai.com).
  companyPhones: (env.VITE_COMPANY_PHONES || '+63 (02) 8893-6251,+63 (02) 8519-2394').split(',').map((p) => p.trim()),
  facebookUrl: env.VITE_FACEBOOK_URL || 'https://www.facebook.com/recruitELITE/',
  // Demo-only credentials: they are bundled into the client JavaScript, so this is NOT real security.
  demoUser: env.VITE_DEMO_USER || 'admin',
  demoPass: env.VITE_DEMO_PASS || 'admin123',
  // 'en' (English) or 'ja' (Japanese). A viewer's own choice in the switcher overrides it.
  defaultLanguage: env.VITE_DEFAULT_LANGUAGE || 'en',
  // 'system' (follow the device), 'light' or 'dark'. A viewer's own choice overrides it.
  defaultTheme: env.VITE_DEFAULT_THEME || 'system',
  // true: fill the portal with fake demo data on first start (recruiters can also load/clear it on the dashboard).
  demoData: env.VITE_DEMO_DATA === 'true',
  sessionKey: env.VITE_SESSION_KEY || 'ej-user',
};

export function companyAddress(language) {
  return language === 'ja' ? config.companyAddressJa : config.companyAddress;
}
