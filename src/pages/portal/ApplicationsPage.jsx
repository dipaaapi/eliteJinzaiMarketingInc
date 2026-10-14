import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/context';
import { listUsers } from '../../auth/authService';
import { useI18n } from '../../i18n/context';
import { get, update, useCollection } from '../../data/db';
import { ACTIVE_STAGES, REQUIREMENTS, REQUIRED_FOR_HIRE, STAGES, missingRequirements } from '../../portal/constants';
import { Badge, Empty, PageHead, Steps } from '../../components/ui';
import { CheckIcon } from '../../components/Icons';

const PIPELINE = ['applied', 'screening', 'interview', 'hired'];

function moveTo(application, stage) {
  update('applications', application.id, {
    stage,
    history: [...(application.history || []), { stage, at: new Date().toISOString() }],
  });
}

// Recruiter view of one application: documents check + stage actions. Service: Pre-employment screening.
function ApplicationCard({ application, applicant, deployed }) {
  const { t, language } = useI18n();
  const job = get('jobs', application.jobId);
  const missing = missingRequirements(application);
  const next = PIPELINE[PIPELINE.indexOf(application.stage) + 1];
  const closed = application.stage === 'hired' || application.stage === 'rejected';

  function toggle(key) {
    update('applications', application.id, {
      requirements: { ...application.requirements, [key]: !application.requirements?.[key] },
    });
  }

  return (
    <article className="Panel App-card">
      <div className="Job-head">
        <div>
          <h3>{applicant?.fullName || application.applicantId}</h3>
          <p className="Muted">
            {job?.title || t('portal.deletedJob')} · {applicant?.email}
            {applicant?.phone ? ` · ${applicant.phone}` : ''}
          </p>
        </div>
        <Badge value={application.stage} />
      </div>

      <Steps steps={PIPELINE} current={application.stage === 'rejected' ? 'applied' : application.stage} failed={application.stage === 'rejected'} />

      <fieldset className="Docs">
        <legend>{t('apps.documents')}</legend>
        {REQUIREMENTS.map((key) => (
          <label key={key} className="Check">
            <input type="checkbox" checked={Boolean(application.requirements?.[key])} onChange={() => toggle(key)} disabled={closed} />
            {t(`careers.req.${key}`)}
          </label>
        ))}
      </fieldset>

      {!closed && (
        <div className="Form-actions">
          {next && (
            <button
              className="Btn Btn--primary"
              type="button"
              disabled={next === 'hired' && missing.length > 0}
              onClick={() => moveTo(application, next)}
            >
              {t('apps.moveTo', { stage: t(`portal.status.${next}`) })}
            </button>
          )}
          <button className="Btn Btn--ghost" type="button" onClick={() => moveTo(application, 'rejected')}>{t('apps.reject')}</button>
        </div>
      )}
      {!closed && next === 'hired' && missing.length > 0 && (
        <p className="Alert Alert--warn">{t('apps.missingDocs', { n: missing.length })}</p>
      )}
      {application.stage === 'hired' && !deployed && (
        <Link className="Btn Btn--ghost" to={`/deployments?application=${application.id}`}>{t('apps.deploy')}</Link>
      )}
      <p className="Muted Small">{t('apps.appliedOn', { date: new Date(application.createdAt).toLocaleDateString(language) })}</p>
    </article>
  );
}

function AdminApplications() {
  const { t } = useI18n();
  const applications = useCollection('applications');
  const jobs = useCollection('jobs');
  const deployments = useCollection('deployments');
  const [params, setParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const stage = params.get('stage') || 'active';
  const jobFilter = params.get('job') || '';

  useEffect(() => {
    listUsers().then(setUsers);
  }, [applications.length]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  // "In progress" also keeps hires that still need a store, so the recruiter can deploy them.
  const awaitingDeploy = (a) => a.stage === 'hired' && !deployments.some((d) => d.applicationId === a.id);
  const inView = (a, s) => (s === 'active' ? ACTIVE_STAGES.includes(a.stage) || awaitingDeploy(a) : s === 'all' || a.stage === s);
  const visible = applications
    .filter((a) => inView(a, stage))
    .filter((a) => !jobFilter || a.jobId === jobFilter)
    .slice()
    .reverse();

  return (
    <div className="Page">
      <PageHead title={t('apps.title')} lead={t('apps.leadAdmin')} mission={t('apps.missionAdmin')} />
      <div className="Toolbar">
        <div className="Chips" role="group" aria-label={t('apps.stage')}>
          {['active', ...STAGES, 'all'].map((s) => (
            <button key={s} type="button" className={stage === s ? 'Chip Chip--on' : 'Chip'} onClick={() => setFilter('stage', s === 'active' ? '' : s)}>
              {s === 'active' ? t('apps.inProgress') : s === 'all' ? t('portal.all') : t(`portal.status.${s}`)}
              {' '}({applications.filter((a) => inView(a, s)).length})
            </button>
          ))}
        </div>
        <select className="Lang-select" aria-label={t('apps.job')} value={jobFilter} onChange={(e) => setFilter('job', e.target.value)}>
          <option value="">{t('apps.allJobs')}</option>
          {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
        </select>
      </div>
      {visible.length === 0 ? (
        <Empty>{t('apps.empty')}</Empty>
      ) : (
        <div className="Stack">
          {visible.map((a) => (
            <ApplicationCard key={a.id} application={a} applicant={users.find((u) => u.username === a.applicantId)} deployed={!awaitingDeploy(a)} />
          ))}
        </div>
      )}
    </div>
  );
}

// Applicant view: progress tracker and document checklist for each application.
function MyApplications() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const applications = useCollection('applications').filter((a) => a.applicantId === user.username);

  return (
    <div className="Page">
      <PageHead title={t('apps.myTitle')} lead={t('apps.leadApplicant')} mission={t('careers.fact.speed')} />
      {applications.length === 0 ? (
        <Empty>
          {t('apps.myEmpty')} <Link to="/jobs">{t('nav.jobs')}</Link>
        </Empty>
      ) : (
        <div className="Stack">
          {applications.slice().reverse().map((a) => {
            const job = get('jobs', a.jobId);
            return (
              <article key={a.id} className="Panel App-card">
                <div className="Job-head">
                  <div>
                    <h3>{job?.title || t('portal.deletedJob')}</h3>
                    <p className="Muted">{job?.location} · {t('apps.appliedOn', { date: new Date(a.createdAt).toLocaleDateString(language) })}</p>
                  </div>
                  <Badge value={a.stage} />
                </div>
                <Steps steps={PIPELINE} current={a.stage === 'rejected' ? 'applied' : a.stage} failed={a.stage === 'rejected'} />
                <p>{t(`apps.next.${a.stage}`)}</p>
                <h4>{t('careers.requirementsTitle')}</h4>
                <ul className="Checklist">
                  {REQUIREMENTS.map((key) => (
                    <li key={key} className={a.requirements?.[key] ? 'is-ok' : 'is-pending'}>
                      <CheckIcon size={20} /> {t(`careers.req.${key}`)}
                      <small> — {a.requirements?.[key] ? t('apps.verified') : REQUIRED_FOR_HIRE.includes(key) ? t('apps.bring') : t('apps.ifRequired')}</small>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ApplicationsPage() {
  const { user } = useAuth();
  return user.role === 'admin' ? <AdminApplications /> : <MyApplications />;
}

export default ApplicationsPage;
