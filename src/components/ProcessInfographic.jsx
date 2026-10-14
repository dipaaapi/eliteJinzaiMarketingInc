import { useI18n } from '../i18n/context';
import { RecruitIcon, TrainingIcon, PlacementIcon, ConsultIcon } from './Icons';

const STEPS = [
  { key: 'recruit', Icon: RecruitIcon },
  { key: 'train', Icon: TrainingIcon },
  { key: 'deploy', Icon: PlacementIcon },
  { key: 'report', Icon: ConsultIcon },
];

// "How we work" infographic: four numbered steps joined by a line (wraps on phones).
function ProcessInfographic() {
  const { t } = useI18n();
  return (
    <ol className="Process">
      {STEPS.map(({ key, Icon }, index) => (
        <li key={key} className="Process-step">
          <span className="Process-badge">
            <Icon size={28} />
            <span className="Process-num">{index + 1}</span>
          </span>
          <h3>{t(`process.${key}.title`)}</h3>
          <p>{t(`process.${key}.text`)}</p>
        </li>
      ))}
    </ol>
  );
}

export default ProcessInfographic;
