import { useEffect, useState } from 'react';
import { config } from '../config';
import en from './en';
import { LANGUAGES, LanguageContext, useI18n } from './context';

const STORAGE_KEY = 'ej-language';

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved in LANGUAGES) return saved;
  } catch { /* storage unavailable */ }
  return config.defaultLanguage in LANGUAGES ? config.defaultLanguage : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = LANGUAGES[language].messages['meta.title'] ?? en['meta.title'];
    try { localStorage.setItem(STORAGE_KEY, language); } catch { /* storage unavailable */ }
  }, [language]);

  // Falls back to English, then to the key itself, so a missing translation never breaks the page.
  function t(key, params = {}) {
    const text = LANGUAGES[language].messages[key] ?? en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '');
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <select
      className={`Lang-select ${className}`}
      aria-label={t('language.label')}
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
    >
      {Object.entries(LANGUAGES).map(([code, { label }]) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  );
}
