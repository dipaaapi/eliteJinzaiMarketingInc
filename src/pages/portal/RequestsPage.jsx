import { useState } from 'react';
import { useAuth } from '../../auth/context';
import { useI18n } from '../../i18n/context';
import { insert, update, useCollection } from '../../data/db';
import { CATEGORIES, REQUEST_STATUSES } from '../../portal/constants';
import { Badge, Empty, PageHead, SelectField } from '../../components/ui';
import { MapIcon, UsersIcon, ClockIcon } from '../../components/Icons';

// Clients: ask for staff. Service: Industry-specific hiring (and bulk/seasonal hiring).
function RequestForm({ user, onDone }) {
  const { t } = useI18n();

  function handleSubmit(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    insert('requests', {
      clientId: user.username,
      company: user.company || user.fullName,
      store: f.store.value.trim(),
      location: f.location.value.trim(),
      category: f.category.value,
      position: f.position.value.trim(),
      headcount: Math.max(1, Number(f.headcount.value) || 1),
      startDate: f.startDate.value,
      notes: f.notes.value.trim(),
      status: 'new',
    });
    onDone();
  }

  return (
    <form className="Panel Form-grid" onSubmit={handleSubmit}>
      <h2>{t('requests.new')}</h2>
      <label className="Field">
        <span>{t('requests.field.position')}</span>
        <input name="position" placeholder={t('requests.field.positionHint')} required />
      </label>
      <SelectField label={t('jobs.field.category')} name="category" options={CATEGORIES} labelFor={(v) => `careers.${v}.title`} />
      <label className="Field">
        <span>{t('requests.field.store')}</span>
        <input name="store" required />
      </label>
      <label className="Field">
        <span>{t('jobs.field.location')}</span>
        <input name="location" required />
      </label>
      <label className="Field">
        <span>{t('requests.field.headcount')}</span>
        <input name="headcount" type="number" min="1" defaultValue="1" required />
      </label>
      <label className="Field">
        <span>{t('requests.field.startDate')}</span>
        <input name="startDate" type="date" required />
      </label>
      <label className="Field Field--wide">
        <span>{t('requests.field.notes')}</span>
        <textarea className="Input" name="notes" rows="3" />
      </label>
      <div className="Form-actions Field--wide">
        <button className="Btn Btn--primary" type="submit">{t('requests.submit')}</button>
        <button className="Btn Btn--ghost" type="button" onClick={onDone}>{t('portal.cancel')}</button>
      </div>
    </form>
  );
}

function RequestsPage() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const requests = useCollection('requests');
  const deployments = useCollection('deployments');
  const jobs = useCollection('jobs');
  const [creating, setCreating] = useState(false);
  const isAdmin = user.role === 'admin';

  const visible = requests.filter((r) => isAdmin || r.clientId === user.username).slice().reverse();
  const filled = (r) => deployments.filter((d) => d.requestId === r.id).length;
  const linkedJob = (r) => jobs.find((j) => j.requestId === r.id);

  function createJob(r) {
    insert('jobs', {
      title: `${r.position} – ${r.company}`,
      category: r.category,
      location: r.location,
      slots: r.headcount,
      employmentType: 'fulltime',
      description: [r.store, r.notes].filter(Boolean).join(' · '),
      status: 'open',
      requestId: r.id,
    });
    if (r.status === 'new') update('requests', r.id, { status: 'sourcing' });
  }

  return (
    <div className="Page">
      <PageHead
        title={t('requests.title')}
        lead={isAdmin ? t('requests.leadAdmin') : t('requests.leadClient')}
        mission={t('vision.text')}
      />
      {!isAdmin && !creating && (
        <div className="Toolbar">
          <button className="Btn Btn--primary" type="button" onClick={() => setCreating(true)}>+ {t('requests.new')}</button>
        </div>
      )}
      {creating && <RequestForm user={user} onDone={() => setCreating(false)} />}

      {visible.length === 0 ? (
        <Empty>{isAdmin ? t('requests.emptyAdmin') : t('requests.emptyClient')}</Empty>
      ) : (
        <div className="Stack">
          {visible.map((r) => (
            <article key={r.id} className="Panel">
              <div className="Job-head">
                <div>
                  <h3>{r.position} × {r.headcount}</h3>
                  <p className="Muted">{r.company} · {t(`careers.${r.category}.title`)}</p>
                </div>
                <Badge value={r.status} />
              </div>
              <p className="Job-meta">
                <span><MapIcon size={16} /> {r.store}, {r.location}</span>
                <span><ClockIcon size={16} /> {t('requests.starts', { date: new Date(r.startDate).toLocaleDateString(language) })}</span>
                <span><UsersIcon size={16} /> {t('requests.filled', { n: filled(r), total: r.headcount })}</span>
              </p>
              <div className="Meter" role="progressbar" aria-valuemin="0" aria-valuemax={r.headcount} aria-valuenow={filled(r)} aria-label={t('requests.filled', { n: filled(r), total: r.headcount })}>
                <span style={{ width: `${Math.min(100, (filled(r) / r.headcount) * 100)}%` }} />
              </div>
              {r.notes && <p>{r.notes}</p>}
              {isAdmin && (
                <div className="Form-actions">
                  <select
                    className="Lang-select"
                    aria-label={t('requests.status')}
                    value={r.status}
                    onChange={(e) => update('requests', r.id, { status: e.target.value })}
                  >
                    {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{t(`portal.status.${s}`)}</option>)}
                  </select>
                  {linkedJob(r) ? (
                    <span className="Muted">{t('requests.jobPosted')}</span>
                  ) : (
                    <button className="Btn Btn--ghost" type="button" onClick={() => createJob(r)}>{t('requests.createJob')}</button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestsPage;
