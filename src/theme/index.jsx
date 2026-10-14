import { useEffect, useState } from 'react';
import { config } from '../config';
import { useI18n } from '../i18n/context';
import { THEMES, THEME_STORAGE_KEY, ThemeContext, useTheme } from './context';

const darkQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)');

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEMES.includes(saved)) return saved;
  } catch { /* storage unavailable */ }
  return THEMES.includes(config.defaultTheme) ? config.defaultTheme : 'system';
}

function systemPrefersDark() {
  return Boolean(darkQuery()?.matches);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Follow the device when it switches between light and dark.
  useEffect(() => {
    const query = darkQuery();
    if (!query) return undefined;
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* storage unavailable */ }
  }, [theme, resolved]);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  return (
    <select
      className={`Lang-select ${className}`}
      aria-label={t('theme.label')}
      value={theme}
      onChange={(event) => setTheme(event.target.value)}
    >
      {THEMES.map((name) => (
        <option key={name} value={name}>{t(`theme.${name}`)}</option>
      ))}
    </select>
  );
}
