import { createContext, useContext } from 'react';
import en from './en';
import ja from './ja';

// To add a language: create a dictionary file and register it here.
export const LANGUAGES = {
  en: { label: 'English', messages: en },
  ja: { label: '日本語', messages: ja },
};

export const LanguageContext = createContext(null);

export function useI18n() {
  return useContext(LanguageContext);
}
