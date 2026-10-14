import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, displayName } from '../auth/context';
import { listUsers } from '../auth/authService';
import { useI18n } from '../i18n/context';
import { today, useCollection } from '../data/db';
import { ACTIVE_STAGES, hoursWorked } from '../portal/constants';
import { Badge, Stat, Steps } from '../components/ui';
import DemoDataPanel from '../components/DemoDataPanel';
import { BriefcaseIcon, ClockIcon, DocumentIcon, MissionIcon, ReceiptIcon, StoreIcon, UsersIcon } from '../components/Icons';

const PIPELINE = ['applied', 'screening', 'interview', 'hired'];

function QuickLinks({ links }) {
  const { t } = useI18n();
  return (
    <div className="Quick">
      {links.map(([to, key]) => (
        <Link key={to} className="Btn Btn--ghost" to={to}>{t(key)} →</Link>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { t } = useI18n();
  const jobs = useCollection('jobs');
  const applications = useCollection('applications');
  const requests = useCollection('requests');
  const deployments = useCollection('deployments');
  const attendance = useCollection('attendance');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    listUsers().then(setUsers);
  }, [applications.length]);

  const active = deployments.filter((d) => d.active);
  const onDutyToday = attendance.filter((a) => a.date === today()).length;
  const missingBenefits = active.filter((d) => !['sss', 'philhealth', 'pagibig'].every((b) => d.benefits?.[b])).length;
  const recentApplicants = users.filter((u) => u.role === 'applicant').slice(-5).reverse();

  return (
    <>
      <div className="Stats-grid">
        <Stat icon={<BriefcaseIcon />} value={jobs.filter((j) => j.status === 'open').length} label={t('dash.openJobs')} />
        <Stat icon={<DocumentIcon />} value={applications.filter((a) => ACTIVE_STAGES.includes(a.stage)).length} label={t('dash.inScreening')} />
        <Stat icon={<ReceiptIcon />} value={requests.filter((r) => ['new', 'sourcing', 'partial'].includes(r.status)).length} label={t('dash.openRequests')} />
        <Stat icon={<StoreIcon />} value={active.length} label={t('dash.deployed')} />
        <Stat icon={<ClockIcon />} value={`${onDutyToday}/${active.length}`} label={t('dash.onDuty')} />
      </div>

      <section className="Panel">
        <h2>{t('dash.pipeline')}</h2>
        <div className="Funnel">
          {['applied', 'screening', 'interview', 'hired', 'rejected'].map((s) => {
            const n = applications.filter((a) => a.stage === s).length;
            return (
              <Link key={s} to={`/applications?stage=${s}`} className={`Funnel-step Funnel-step--${s}`}>
                <strong>{n}</strong>
                <span>{t(`portal.status.${s}`)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="Cards Cards--2">
        <section className="Panel">
          <h2>{t('dash.attention')}</h2>
          <ul className="Checklist">
            <li>{t('dash.newRequests', { n: requests.filter((r) => r.status === 'new').length })}</li>
            <li>{t('dash.waitingApplicants', { n: applications.filter((a) => a.stage === 'applied').length })}</li>
            <li>{t('dash.readyToDeploy', { n: applications.filter((a) => a.stage === 'hired' && !deployments.some((d) => d.applicationId === a.id)).length })}</li>
            <li>{t('dash.benefitsPending', { n: missingBenefits })}</li>
          </ul>
        </section>
        <section className="Panel">
          <h2><UsersIcon size={20} /> {t('dash.newApplicants')}</h2>
          {recentApplicants.length === 0 ? (
            <p className="Muted">{t('dashboard.staffEmpty')}</p>
          ) : (
            <ul className="People">
              {recentApplicants.map((u) => (
                <li key={u.id}><strong>{u.fullName}</strong> <span className="Muted">{u.email}</span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <QuickLinks links={[['/jobs', 'nav.jobs'], ['/applications', 'nav.applications'], ['/requests', 'nav.requests'], ['/deployments', 'nav.deployments']]} />
      <DemoDataPanel />
    </>
  );
}

function ApplicantDashboard({ user }) {
  const { t } = useI18n();
  const jobs = useCollection('jobs');
  const applications = useCollection('applications').filter((a) => a.applicantId === user.username);
  const deployment = useCollection('deployments').find((d) => d.employeeId === user.username && d.active);
  const attendance = useCollection('attendance').filter((a) => a.employeeId === user.username);
  const latest = applications[applications.length - 1];
  const monthHours = attendance.filter((a) => a.date.startsWith(today().slice(0, 7))).reduce((s, a) => s + (hoursWorked(a) || 0), 0);

  return (
    <>
      <div className="Stats-grid">
        <Stat icon={<BriefcaseIcon />} value={jobs.filter((j) => j.status === 'open').length} label={t('dash.openJobs')} />
        <Stat icon={<DocumentIcon />} value={applications.length} label={t('dash.myApplications')} />
        <Stat icon={<ClockIcon />} value={monthHours.toFixed(1)} label={t('dash.myHours')} />
      </div>
      {deployment ? (
        <section className="Panel">
          <h2><StoreIcon size={20} /> {t('dash.assignment')}</h2>
          <p><strong>{deployment.company}</strong> — {deployment.store}</p>
          <Link className="Btn Btn--primary" to="/deployments">{t('deploy.timeIn')} / {t('deploy.timeOut')}</Link>
        </section>
      ) : latest ? (
        <section className="Panel">
          <h2>{t('dash.latestApplication')}</h2>
          <p><strong>{jobs.find((j) => j.id === latest.jobId)?.title}</strong> <Badge value={latest.stage} /></p>
          <Steps steps={PIPELINE} current={latest.stage === 'rejected' ? 'applied' : latest.stage} failed={latest.stage === 'rejected'} />
          <p>{t(`apps.next.${latest.stage}`)}</p>
        </section>
      ) : (
        <section className="Panel">
          <h2>{t('dash.getStarted')}</h2>
          <p>{t('dash.getStartedText')}</p>
          <Link className="Btn Btn--primary" to="/jobs">{t('nav.jobs')}</Link>
        </section>
      )}
      <QuickLinks links={[['/jobs', 'nav.jobs'], ['/applications', 'nav.myApplications'], ['/deployments', 'nav.myAssignment'], ['/account', 'nav.account']]} />
    </>
  );
}

function ClientDashboard({ user }) {
  const { t } = useI18n();
  const requests = useCollection('requests').filter((r) => r.clientId === user.username);
  const deployments = useCollection('deployments').filter((d) => d.clientId === user.username && d.active);
  const attendance = useCollection('attendance');
  const present = deployments.filter((d) => attendance.some((a) => a.deploymentId === d.id && a.date === today())).length;
  const requested = requests.filter((r) => r.status !== 'cancelled').reduce((s, r) => s + r.headcount, 0);

  return (
    <>
      <div className="Stats-grid">
        <Stat icon={<ReceiptIcon />} value={requests.filter((r) => ['new', 'sourcing', 'partial'].includes(r.status)).length} label={t('dash.openRequests')} />
        <Stat icon={<UsersIcon />} value={`${deployments.length}/${requested}`} label={t('dash.staffFilled')} />
        <Stat icon={<ClockIcon />} value={`${present}/${deployments.length}`} label={t('dash.onDuty')} />
      </div>
      <section className="Panel">
        <h2>{t('dash.clientNext')}</h2>
        <p>{requests.length === 0 ? t('dash.clientFirst') : t('dash.clientTrack')}</p>
        <Link className="Btn Btn--primary" to="/requests">{t('requests.new')}</Link>
      </section>
      <QuickLinks links={[['/requests', 'nav.requests'], ['/deployments', 'nav.myStaff'], ['/account', 'nav.account']]} />
    </>
  );
}

function DashboardPage() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const date = new Date().toLocaleDateString(language, { dateStyle: 'full' });

  return (
    <div className="Page">
      <header className="Page-head">
        <h1>{t('dashboard.welcome', { name: displayName(user, t) })}</h1>
        <p className="Muted">{date} · {t(`role.${user.role}`)}{user.company ? ` · ${user.company}` : ''}</p>
      </header>
      <aside className="Mission-banner">
        <MissionIcon size={22} />
        <p><strong>{t('mission.title')}:</strong> {t(`dash.mission.${user.role}`)}</p>
      </aside>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'applicant' && <ApplicantDashboard user={user} />}
      {user.role === 'client' && <ClientDashboard user={user} />}
    </div>
  );
}

export default DashboardPage;
