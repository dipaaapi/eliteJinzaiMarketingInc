import { useI18n } from '../i18n/context';
import Logo from './Logo';
import { ClockIcon, ConsultIcon, MapIcon, PlacementIcon, RecruitIcon, ReceiptIcon, ShieldIcon } from './Icons';

// The business cycle: brands ask for staff → we recruit & train → staff sell in stores → results go back.
const STEPS = [
  { key: 'brands', Icon: ReceiptIcon, pos: 'top' },
  { key: 'recruit', Icon: RecruitIcon, pos: 'right' },
  { key: 'stores', Icon: PlacementIcon, pos: 'bottom' },
  { key: 'results', Icon: ConsultIcon, pos: 'left' },
];

const FACTS = [
  { key: 'years', Icon: ClockIcon, value: '15+' },
  { key: 'founded', Icon: ShieldIcon },
  { key: 'base', Icon: MapIcon },
];

function HeroInfographic() {
  const { t } = useI18n();

  return (
    <figure className="HeroInfo" aria-labelledby="hero-info-title">
      <figcaption id="hero-info-title" className="HeroInfo-title">{t('heroInfo.title')}</figcaption>

      <div className="HeroInfo-cycle">
        {/* Dashed ring with arrowheads showing the direction of the cycle. */}
        <svg className="HeroInfo-ring" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <marker id="hero-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" fill="currentColor" />
            </marker>
          </defs>
          {[
            'M290 62 A165 165 0 0 1 338 110',
            'M338 290 A165 165 0 0 1 290 338',
            'M110 338 A165 165 0 0 1 62 290',
            'M62 110 A165 165 0 0 1 110 62',
          ].map((d) => (
            <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 7" markerEnd="url(#hero-arrow)" />
          ))}
        </svg>

        <div className="HeroInfo-center">
          <Logo markOnly height={52} />
        </div>

        <ol className="HeroInfo-steps">
          {STEPS.map(({ key, Icon, pos }, index) => (
            <li key={key} className={`HeroInfo-step HeroInfo-step--${pos}`} style={{ '--i': index }}>
              <span className="HeroInfo-icon">
                <Icon size={24} />
                <span className="HeroInfo-num">{index + 1}</span>
              </span>
              <strong>{t(`heroInfo.${key}.title`)}</strong>
              <span>{t(`heroInfo.${key}.text`)}</span>
            </li>
          ))}
        </ol>
      </div>

      <ul className="HeroInfo-facts">
        {FACTS.map(({ key, Icon, value }) => (
          <li key={key}>
            <Icon size={20} />
            <span>
              <strong>{value ?? t(`heroInfo.fact.${key}.value`)}</strong>
              <small>{t(`heroInfo.fact.${key}.label`)}</small>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default HeroInfographic;
