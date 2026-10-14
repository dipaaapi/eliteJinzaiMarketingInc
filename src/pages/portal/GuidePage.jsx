import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context';
import { useI18n } from '../../i18n/context';
import { useHelp } from '../../help/useHelp';
import { FaqGroup, SearchBox } from '../../help/Faq';
import { Badge, PageHead } from '../../components/ui';

// Step-by-step guide for one role.
function RoleGuide({ guide }) {
  return (
    <ol className="Guide-steps">
      {guide.steps.map(([title, text], index) => (
        <li key={title}>
          <span className="Guide-num">{index + 1}</span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Portal help for signed-in users: their role's guide first, then statuses and FAQ.
function GuidePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const help = useHelp().portal;
  const [query, setQuery] = useState('');
  // Recruiters may need to explain the portal to applicants and clients, so they can open every guide.
  const roles = user.role === 'admin' ? ['admin', 'applicant', 'client'] : [user.role];
  const [shown, setShown] = useState(user.role);

  return (
    <div className="Page">
      <PageHead title={help.title} lead={help.lead} />

      <section className="Panel">
        <h2>{help.yourGuide}: {help.guides[shown].title}</h2>
        {roles.length > 1 && (
          <div className="Chips" role="group" aria-label={help.otherGuides}>
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={shown === role ? 'Chip Chip--on' : 'Chip'}
                aria-pressed={shown === role}
                onClick={() => setShown(role)}
              >
                {help.guides[role].title}
              </button>
            ))}
          </div>
        )}
        <RoleGuide key={shown} guide={help.guides[shown]} />
      </section>

      <section className="Panel">
        <h2>{help.glossaryTitle}</h2>
        <dl className="Glossary">
          {help.glossary.map(([status, meaning]) => (
            <div key={status}>
              <dt><Badge value={status} /></dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="Panel">
        <div className="Toolbar">
          <h2>{help.faqTitle}</h2>
          <SearchBox value={query} onChange={setQuery} label={t('help.searchPortal')} />
        </div>
        {roles.map((role) => (
          <FaqGroup key={role} title={help.guides[role].title} items={help.faq[role]} query={query} />
        ))}
        <p className="Muted">
          <Link to="/help">{help.publicLink} →</Link>
        </p>
      </section>
    </div>
  );
}

export default GuidePage;
