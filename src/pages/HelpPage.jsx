import { useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config';
import { useHelp, matches } from '../help/useHelp';
import { FaqGroup, SearchBox } from '../help/Faq';
import { PhoneIcon, RecruitIcon, StoreIcon } from '../components/Icons';

const START_ICONS = { applicants: RecruitIcon, clients: StoreIcon };
const START_LINKS = { applicants: '/account?mode=register', clients: '/account?mode=register&type=client' };

// Public help for first-time visitors: quick-start guides + searchable FAQ.
function HelpPage() {
  const help = useHelp().public;
  const [query, setQuery] = useState('');
  const anyMatch = help.sections.some((s) => s.items.some((item) => matches(query, item)));

  return (
    <div className="Help">
      <section className="Help-hero">
        <h1>{help.title}</h1>
        <p className="Lead">{help.lead}</p>
        <SearchBox value={query} onChange={setQuery} label={help.search} />
      </section>

      {!query.trim() && (
        <section className="Section Help-starts">
          {help.starts.map((start) => {
            const Icon = START_ICONS[start.id];
            return (
              <article key={start.id} className="Card Help-start">
                <span className="Card-icon"><Icon /></span>
                <h2>{start.title}</h2>
                <ol className="Help-steps">
                  {start.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <Link className="Btn Btn--primary" to={START_LINKS[start.id]}>{start.cta}</Link>
              </article>
            );
          })}
        </section>
      )}

      <section className="Section Help-faq">
        {!query.trim() && (
          <nav className="Chips" aria-label={help.title}>
            {help.sections.map((s) => (
              <a key={s.id} className="Chip" href={`#faq-${s.id}`}>{s.title}</a>
            ))}
          </nav>
        )}
        {help.sections.map((s) => (
          <div key={s.id} id={`faq-${s.id}`}>
            <FaqGroup title={s.title} items={s.items} query={query} />
          </div>
        ))}
        {!anyMatch && <p className="Empty">{help.noResults}</p>}

        <aside className="Help-contact">
          <h2>{help.stillStuck}</h2>
          <p>
            <PhoneIcon size={18} />{' '}
            {config.companyPhones.join(' · ')}
          </p>
          <Link className="Btn Btn--ghost" to="/#contact">{help.contactCta}</Link>
        </aside>
      </section>
    </div>
  );
}

export default HelpPage;
