import { useI18n } from '../i18n/context';

// Coloured pill for a status value; tone is picked from the value so colours stay consistent.
const TONES = {
  open: 'good', hired: 'good', filled: 'good', active: 'good', yes: 'good',
  applied: 'info', new: 'info', screening: 'info', sourcing: 'info',
  interview: 'warn', partial: 'warn', no: 'warn',
  rejected: 'bad', cancelled: 'bad', closed: 'muted', ended: 'muted',
};

export function Badge({ value, label }) {
  const { t } = useI18n();
  return <span className={`Badge Badge--${TONES[value] || 'muted'}`}>{label ?? t(`portal.status.${value}`)}</span>;
}

export function Stat({ icon, value, label }) {
  return (
    <div className="Stat">
      <span className="Card-icon">{icon}</span>
      <span>
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

export function Empty({ children }) {
  return <p className="Empty">{children}</p>;
}

// Horizontal step tracker, e.g. Applied → Screening → Interview → Hired.
export function Steps({ steps, current, failed = false }) {
  const { t } = useI18n();
  const index = steps.indexOf(current);
  return (
    <ol className={failed ? 'Steps Steps--failed' : 'Steps'}>
      {steps.map((step, i) => (
        <li key={step} className={i < index ? 'is-done' : i === index ? 'is-current' : ''}>
          <span className="Steps-dot">{i < index ? '✓' : i + 1}</span>
          <span>{t(`portal.status.${step}`)}</span>
        </li>
      ))}
    </ol>
  );
}

// Header used at the top of each portal page, with an optional line from the company mission.
export function PageHead({ title, lead, mission }) {
  return (
    <header className="Page-head">
      <h1>{title}</h1>
      {lead && <p className="Muted">{lead}</p>}
      {mission && <p className="Mission-note">{mission}</p>}
    </header>
  );
}

export function SelectField({ label, name, options, value, defaultValue, onChange, labelFor, required }) {
  const { t } = useI18n();
  return (
    <label className="Field">
      <span>{label}</span>
      <select className="Input" name={name} value={value} defaultValue={defaultValue} onChange={onChange} required={required}>
        {options.map((option) => (
          <option key={option} value={option}>{t(labelFor(option))}</option>
        ))}
      </select>
    </label>
  );
}
