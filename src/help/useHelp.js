import { useI18n } from '../i18n/context';
import en from './content.en';
import ja from './content.ja';

const CONTENT = { en, ja };

// Help/FAQ content in the current language (falls back to English).
export function useHelp() {
  const { language } = useI18n();
  return CONTENT[language] || en;
}

// Case-insensitive match on question or answer; an empty query matches everything.
export function matches(query, [question, answer]) {
  const q = query.trim().toLowerCase();
  return !q || question.toLowerCase().includes(q) || answer.toLowerCase().includes(q);
}
