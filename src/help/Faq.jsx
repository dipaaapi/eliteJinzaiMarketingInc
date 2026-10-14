import { useId } from 'react';
import { matches } from './useHelp';

// One question that opens and closes (native <details>, so it works with keyboard and screen readers).
function FaqItem({ question, answer, open }) {
  return (
    <details className="Faq-item" open={open || undefined}>
      <summary>
        <span>{question}</span>
        <span className="Faq-chevron" aria-hidden="true" />
      </summary>
      <div className="Faq-answer">
        <p>{answer}</p>
      </div>
    </details>
  );
}

// A titled group of questions, filtered by `query`. Renders nothing when no question matches.
export function FaqGroup({ title, items, query = '' }) {
  const id = useId();
  const visible = items.filter((item) => matches(query, item));
  if (visible.length === 0) return null;
  return (
    <section className="Faq-group" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {visible.map(([question, answer]) => (
        // While searching, open the matches so the answer is visible right away.
        <FaqItem key={question} question={question} answer={answer} open={Boolean(query.trim())} />
      ))}
    </section>
  );
}

export function SearchBox({ value, onChange, label }) {
  return (
    <label className="Faq-search">
      <span className="Visually-hidden">{label}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} />
    </label>
  );
}
