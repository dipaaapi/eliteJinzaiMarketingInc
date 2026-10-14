import { createContext, useContext } from 'react';

// 'system' follows the device setting; 'light' and 'dark' override it.
export const THEMES = ['system', 'light', 'dark'];
export const THEME_STORAGE_KEY = 'ej-theme';

export const ThemeContext = createContext(null);

export function useTheme() {
  return useContext(ThemeContext);
}
