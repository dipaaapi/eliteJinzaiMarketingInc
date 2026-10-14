import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context';
import { useI18n } from '../../i18n/context';
import { insert, update, useCollection } from '../../data/db';
import { CATEGORIES, EMPLOYMENT_TYPES } from '../../portal/constants';
import { Badge, Empty, PageHead, SelectField } from '../../components/ui';
import { BriefcaseIcon, MapIcon, UsersIcon } from '../../components/Icons';

// Recruiters: post and manage openings. Service: Recruitment & talent sourcing.
function JobForm({ job, onDone }) {
  const { t } = useI18n();

  function handleSubmit(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    const data = {
      title: f.title.value.trim(),
      category: f.category.value,
      location: f.location.value.trim(),
      slots: Math.max(1, Number(f.slots.value) || 1),
      employmentType: f.employmentType.value,
      description: f.description.value.trim(),
    };
    if (job) update('jobs', job.id, data);
    else insert('jobs', { ...data, status: 'open' });
    onDone();
  }

  return (
    <form className="Panel Form-grid" onSubmit={handleSubmit}>
      <h2>{job ? t('jobs.edit') : t('jobs.new')}</h2>
      <label className="Field Field--wide">
        <span>{t('jobs.field.title')}</span>
        <input name="title" defaultValue={job?.title} required />
      </label>
      <SelectField label={t('jobs.field.category')} name="category" options={CATEGORIES} defaultValue={job?.category} labelFor={(v) => `careers.${v}.title`} />
      <SelectField label={t('jobs.field.type')} name="employmentType" options={EMPLOYMENT_TYPES} defaultValue={job?.employmentType} labelFor={(v) => `portal.type.${v}`} />
      <label className="Field">
        <span>{t('jobs.field.location')}</span>
        <input name="location" defaultValue={job?.location} required />
      </label>
      <label className="Field">
        <span>{t('jobs.field.slots')}</span>
        <input name="slots" type="number" min="1" defaultValue={job?.slots ?? 1} required />
      </label>
      <label className="Field Field--wide">
        <span>{t('jobs.field.description')}</span>
        <textarea className="Input" name="description" rows="3" defaultValue={job?.description} />
      </label>
      <div className="Form-actions Field--wide">
        <button className="Btn Btn--primary" type="submit">{t('settings.save')}</button>
        <button className="Btn Btn--ghost" type="button" onClick={onDone}>{t('portal.cancel')}</button>
      </div>
    </form>
  );
}

function JobsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const jobs = useCollection('jobs');
  const applications = useCollection('applications');
  const [editing, setEditing] = useState(null); // null | 'new' | job
  const [filter, setFilter] = useState('all');
  const isAdmin = user.role === 'admin';

  const visible = jobs
    .filter((job) => (isAdmin ? true : job.status === 'open'))
    .filter((job) => filter === 'all' || job.category === filter)
    .slice()
    .reverse();
  const myApplication = (jobId) => applications.find((a) => a.jobId === jobId && a.applicantId === user.username);
  const applicantCount = (jobId) => applications.filter((a) => a.jobId === jobId).length;

  function apply(job) {
    insert('applications', {
      jobId: job.id,
      applicantId: user.username,
      stage: 'applied',
      requirements: {},
      history: [{ stage: 'applied', at: new Date().toISOString() }],
    });
  }

  return (
    <div className="Page">
      <PageHead
        title={t('jobs.title')}
        lead={isAdmin ? t('jobs.leadAdmin') : t('jobs.leadApplicant')}
        mission={isAdmin ? null : t('careers.fact.fees')}
      />

      <div className="Toolbar">
        <div className="Chips" role="group" aria-label={t('jobs.field.category')}>
          {['all', ...CATEGORIES].map((c) => (
            <button key={c} type="button" className={filter === c ? 'Chip Chip--on' : 'Chip'} onClick={() => setFilter(c)}>
              {c === 'all' ? t('portal.all') : t(`careers.${c}.title`)}
            </button>
          ))}
        </div>
        {isAdmin && !editing && (
          <button className="Btn Btn--primary" type="button" onClick={() => setEditing('new')}>+ {t('jobs.new')}</button>
        )}
      </div>

      {editing && <JobForm job={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}

      {visible.length === 0 ? (
        <Empty>{t('jobs.empty')}</Empty>
      ) : (
        <div className="Cards Cards--2">
          {visible.map((job) => {
            const mine = myApplication(job.id);
            return (
              <article key={job.id} className="Card Job">
                <div className="Job-head">
                  <h3>{job.title}</h3>
                  {isAdmin && <Badge value={job.status} />}
                </div>
                <p className="Job-meta">
                  <span><BriefcaseIcon size={16} /> {t(`careers.${job.category}.title`)} · {t(`portal.type.${job.employmentType}`)}</span>
                  <span><MapIcon size={16} /> {job.location}</span>
                  <span><UsersIcon size={16} /> {t('jobs.slots', { n: job.slots })}</span>
                </p>
                {job.description && <p>{job.description}</p>}
                <div className="Form-actions">
                  {isAdmin ? (
                    <>
                      <Link className="Btn Btn--ghost" to={`/applications?job=${job.id}`}>
                        {t('jobs.applicants', { n: applicantCount(job.id) })}
                      </Link>
                      <button className="Btn Btn--ghost" type="button" onClick={() => setEditing(job)}>{t('jobs.edit')}</button>
                      <button
                        className="Btn Btn--ghost"
                        type="button"
                        onClick={() => update('jobs', job.id, { status: job.status === 'open' ? 'closed' : 'open' })}
                      >
                        {job.status === 'open' ? t('jobs.close') : t('jobs.reopen')}
                      </button>
                    </>
                  ) : mine ? (
                    <Link className="Btn Btn--ghost" to="/applications">
                      {t('jobs.applied')} · {t(`portal.status.${mine.stage}`)}
                    </Link>
                  ) : user.role === 'applicant' ? (
                    <button className="Btn Btn--primary" type="button" onClick={() => apply(job)}>{t('jobs.apply')}</button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default JobsPage;
