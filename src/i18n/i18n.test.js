import en from './en';
import ja from './ja';

// Every English text must have a Japanese translation (and no leftovers the other way).
test('English and Japanese dictionaries have the same keys', () => {
  const missingInJa = Object.keys(en).filter((key) => !(key in ja));
  const extraInJa = Object.keys(ja).filter((key) => !(key in en));
  expect({ missingInJa, extraInJa }).toEqual({ missingInJa: [], extraInJa: [] });
});

test('Japanese texts are actually translated', () => {
  // Keys whose Japanese text may legitimately match English (brand names, empty values).
  const same = new Set(['meta.title', 'heroInfo.recruit.title']);
  const untranslated = Object.keys(en).filter((key) => en[key] && en[key] === ja[key] && !same.has(key));
  expect(untranslated).toEqual([]);
});
