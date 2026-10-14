import { Link } from 'react-router-dom';
import { config, companyAddress } from '../config';
import { useI18n } from '../i18n/context';
import ProcessInfographic from '../components/ProcessInfographic';
import HeroInfographic from '../components/HeroInfographic';
import {
  RecruitIcon, ScreeningIcon, StoreIcon, ReceiptIcon, CheckIcon, ShieldIcon,
  MissionIcon, VisionIcon, ValuesIcon, MapIcon, PhoneIcon, ClockIcon,
  BriefcaseIcon, BoxIcon, UsersIcon, DocumentIcon, ExternalIcon,
} from '../components/Icons';

// Company content is from the official website (elitejinzai.com); texts live in src/i18n.
const SERVICES = [
  { key: 'recruitment', Icon: RecruitIcon },
  { key: 'screening', Icon: ScreeningIcon },
  { key: 'industry', Icon: StoreIcon },
  { key: 'payroll', Icon: ReceiptIcon },
];
const MORE_SERVICES = ['supervision', 'timekeeping', 'compliance', 'account', 'bulk', 'replacement'];
const WHY = ['brands', 'retail', 'teams', 'growth'];
const VALUES = ['integrity', 'professionalism', 'compliance', 'growth'];
const TEAMS = [
  { key: 'hr', photo: 'team-hr.webp' },
  { key: 'recruitment', photo: 'team-recruitment.webp' },
  { key: 'operations', photo: 'team-operations.webp' },
  { key: 'field', photo: 'team-field-supervisors.webp' },
  { key: 'accounting', photo: 'team-accounting.webp' },
];
const ROLES = [
  { key: 'frontline', Icon: UsersIcon },
  { key: 'backoffice', Icon: BriefcaseIcon },
  { key: 'warehouse', Icon: BoxIcon },
];
const REQUIREMENTS = ['resume', 'ids', 'nbi', 'barangay', 'diploma'];
const CAREER_FACTS = ['fees', 'speed', 'fresh', 'benefits', 'type'];
// "+63 (02) 8893-6251" -> "tel:+63288936251" (the trunk 0 is dropped after a country code).
function telLink(phone) {
  return `tel:${phone.replace(/\(0(\d+)\)/, '$1').replace(/[^\d+]/g, '')}`;
}

const KANJI = [
  { char: '人', reading: 'Jin', key: 'jin' },
  { char: '材', reading: 'Zai', key: 'zai1' },
  { char: '財', reading: 'Zai', key: 'zai2' },
];

function HomePage() {
  const { t, language } = useI18n();

  return (
    <>
      <section className="Hero">
        <div className="Hero-text">
          <p className="Eyebrow">{t('home.eyebrow')}</p>
          <h1>{config.companyName}</h1>
          {t('company.nameLocal') && <p className="Hero-local" lang="ja">{t('company.nameLocal')}</p>}
          <p className="Lead">{t('home.tagline')}</p>
          <p className="Slogan">{t('home.slogan')}</p>
          <div className="Hero-actions">
            <Link className="Btn Btn--primary Btn--lg" to="/account?mode=register">{t('home.ctaJoin')}</Link>
            <Link className="Btn Btn--ghost Btn--lg" to="/account">{t('home.ctaLogin')}</Link>
          </div>
        </div>
        <HeroInfographic />
      </section>

      <section id="about" className="Section">
        <h2>{t('about.title')}</h2>
        <div className="Split">
          <div>
            <p className="Section-lead">{t('about.text')}</p>
            <p>{t('about.fivePs')}</p>
            <p className="Muted">{t('about.founder')}</p>
          </div>
          <aside className="Kanji" aria-label={t('about.jinzaiTitle')}>
            <p className="Kanji-title">{t('about.jinzaiTitle')}</p>
            <ul>
              {KANJI.map(({ char, reading, key }) => (
                <li key={key}>
                  <span className="Kanji-char" lang="ja">{char}</span>
                  <span><strong>{reading}</strong> {t(`about.kanji.${key}`)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <ul className="Stats">
          <li><strong>15+</strong><span>{t('about.stat.years')}</span></li>
          <li><strong>2010</strong><span>{t('about.stat.founded')}</span></li>
          <li><strong>101–1,000</strong><span>{t('about.stat.people')}</span></li>
          <li><strong>{t('about.stat.baseValue')}</strong><span>{t('about.stat.base')}</span></li>
        </ul>
      </section>

      <section id="services" className="Section Section--tint">
        <h2>{t('services.title')}</h2>
        <p className="Section-lead">{t('services.lead')}</p>
        <div className="Cards">
          {SERVICES.map(({ key, Icon }) => (
            <article key={key} className="Card">
              <span className="Card-icon"><Icon /></span>
              <h3>{t(`services.${key}.title`)}</h3>
              <p>{t(`services.${key}.text`)}</p>
            </article>
          ))}
        </div>
        <div className="Split Split--media">
          <img
            className="Photo"
            src="/images/company/services.webp"
            alt={t('services.imageAlt')}
            width="869"
            height="461"
            loading="lazy"
          />
          <div>
            <h3>{t('services.moreTitle')}</h3>
            <ul className="Checklist">
              {MORE_SERVICES.map((key) => (
                <li key={key}><CheckIcon size={20} /> {t(`services.more.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>
        <h2 className="Section-sub">{t('process.title')}</h2>
        <ProcessInfographic />
      </section>

      <section className="Section Why">
        <h2>{t('why.title')}</h2>
        <ol className="Why-list">
          {WHY.map((key, index) => (
            <li key={key}>
              <span className="Why-num">{String(index + 1).padStart(2, '0')}</span>
              {t(`why.${key}`)}
            </li>
          ))}
        </ol>
      </section>

      <section id="mission" className="Section Section--tint">
        <h2>{t('mission.sectionTitle')}</h2>
        <div className="Cards Cards--2">
          <article className="Card Card--accent">
            <span className="Card-icon"><MissionIcon /></span>
            <h3>{t('mission.title')}</h3>
            <p>{t('mission.text')}</p>
          </article>
          <article className="Card Card--accent">
            <span className="Card-icon"><VisionIcon /></span>
            <h3>{t('vision.title')}</h3>
            <p>{t('vision.text')}</p>
          </article>
        </div>
        <h3 className="Values-title"><ValuesIcon size={24} /> {t('values.title')}</h3>
        <ul className="Values">
          {VALUES.map((key) => (
            <li key={key}>
              <strong>{t(`values.${key}.title`)}</strong>
              <span>{t(`values.${key}.text`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="team" className="Section">
        <h2>{t('team.title')}</h2>
        <p className="Section-lead">{t('team.lead')}</p>
        <div className="Team">
          {TEAMS.map(({ key, photo }) => (
            <article key={key} className="Team-card">
              <img
                src={`/images/company/${photo}`}
                alt={t('team.photoAlt', { team: t(`team.${key}.title`) })}
                loading="lazy"
                width="400"
                height="380"
              />
              <div>
                <h3>{t(`team.${key}.title`)}</h3>
                <p>{t(`team.${key}.text`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="careers" className="Section Section--tint">
        <h2>{t('careers.title')}</h2>
        <p className="Section-lead">{t('careers.lead')}</p>
        <div className="Cards Cards--3">
          {ROLES.map(({ key, Icon }) => (
            <article key={key} className="Card">
              <span className="Card-icon"><Icon /></span>
              <h3>{t(`careers.${key}.title`)}</h3>
              <p>{t(`careers.${key}.text`)}</p>
            </article>
          ))}
        </div>
        <div className="Split Split--even">
          <div className="Panel">
            <h3><DocumentIcon size={22} /> {t('careers.requirementsTitle')}</h3>
            <ul className="Checklist">
              {REQUIREMENTS.map((key) => (
                <li key={key}><CheckIcon size={20} /> {t(`careers.req.${key}`)}</li>
              ))}
            </ul>
          </div>
          <div className="Panel">
            <h3><ShieldIcon size={22} /> {t('careers.factsTitle')}</h3>
            <ul className="Checklist">
              {CAREER_FACTS.map((key) => (
                <li key={key}><CheckIcon size={20} /> {t(`careers.fact.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="Hero-actions">
          <a className="Btn Btn--primary" href={config.facebookUrl} target="_blank" rel="noopener noreferrer">
            {t('careers.apply')} <ExternalIcon size={18} />
          </a>
          <Link className="Btn Btn--ghost" to="/account?mode=register">{t('careers.register')}</Link>
        </div>
      </section>

      <section className="Section Members" aria-labelledby="members-title">
        <h2 id="members-title">{t('members.title')}</h2>
        <ul className="Members-list">
          <li>
            <img src="/images/company/palscon.png" alt="PALSCON" height="48" width="218" loading="lazy" />
            <span>{t('members.palscon')}</span>
          </li>
          <li>
            <img src="/images/company/pmap.png" alt="PMAP" height="48" width="48" loading="lazy" />
            <span>{t('members.pmap')}</span>
          </li>
          <li>
            <span className="Members-badge"><ShieldIcon size={28} /> DOLE</span>
            <span>{t('members.dole')}</span>
          </li>
        </ul>
      </section>

      <section id="contact" className="Section Section--tint">
        <h2>{t('contact.title')}</h2>
        <p className="Section-lead">{t('contact.text')}</p>
        <div className="Cards Cards--contact">
          <div className="Card">
            <span className="Card-icon"><MapIcon /></span>
            <h3>{t('contact.address')}</h3>
            <p>{companyAddress(language)}</p>
          </div>
          <div className="Card">
            <span className="Card-icon"><PhoneIcon /></span>
            <h3>{t('contact.phone')}</h3>
            {config.companyPhones.map((phone) => (
              <p key={phone}><a href={telLink(phone)}>{phone}</a></p>
            ))}
          </div>
          <div className="Card">
            <span className="Card-icon"><ClockIcon /></span>
            <h3>{t('contact.hours')}</h3>
            <p>{t('contact.hoursValue')}</p>
          </div>
          <div className="Card">
            <span className="Card-icon"><ExternalIcon /></span>
            <h3>{t('contact.follow')}</h3>
            <p>
              <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer">{t('contact.facebook')}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
