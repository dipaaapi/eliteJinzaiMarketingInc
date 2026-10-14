import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/context';
import { listUsers } from '../../auth/authService';
import { useI18n } from '../../i18n/context';
import { get, insert, today, update, useCollection } from '../../data/db';
import { BENEFITS, hoursWorked, nowTime } from '../../portal/constants';
import { Badge, Empty, PageHead } from '../../components/ui';
import { CheckIcon, ClockIcon, MapIcon, ShieldIcon } from '../../components/Icons';

function useUsers(dep) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    listUsers().then(setUsers);
  }, [dep]);
  return users;
}

function totalHours(entries) {
  return entries.reduce((sum, e) => sum + (hoursWorked(e) || 0), 0);
}

function monthEntries(attendance, deploymentId) {
  const month = today().slice(0, 7);
  return attendance.filter((a) => a.deploymentId === deploymentId && a.date.startsWith(month));
}

// Recruiters: place a hired applicant at a client store.
function DeployForm({ users, onDone, preselect }) {
  const { t } = useI18n();
  const applications = useCollection('applications');
  const deployments = useCollection('deployments');
  const requests = useCollection('requests');
  const hired = applications.filter((a) => a.stage === 'hired' && !deployments.some((d) => d.applicationId === a.id && d.active));
  const openRequests = requests.filter((r) => !['filled', 'cancelled'].includes(r.status));
  const [requestId, setRequestId] = useState('');
  const request = openRequests.find((r) => r.id === requestId);
  const name = (username) => users.find((u) => u.username === username)?.fullName || username;

  function handleSubmit(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    const application = get('applications', f.application.value);
    insert('deployments', {
      applicationId: application.id,
      employeeId: application.applicantId,
      requestId: request?.id || null,
      clientId: request?.clientId || null,
      company: f.company.value.trim(),
      store: f.store.value.trim(),
      startDate: f.startDate.value,
      benefits: {},
      visits: [],
      active: true,
    });
    if (request) {
      const filled = deployments.filter((d) => d.requestId === request.id).length + 1;
      update('requests', request.id, { status: filled >= request.headcount ? 'filled' : 'partial' });
    }
    onDone();
  }

  if (hired.length === 0) return <p className="Alert Alert--warn">{t('deploy.noneHired')}</p>;

  return (
    <form className="Panel Form-grid" onSubmit={handleSubmit}>
      <h2>{t('deploy.new')}</h2>
      <label className="Field">
        <span>{t('deploy.employee')}</span>
        <select className="Input" name="application" defaultValue={preselect || hired[0].id} required>
          {hired.map((a) => (
            <option key={a.id} value={a.id}>{name(a.applicantId)} — {get('jobs', a.jobId)?.title}</option>
          ))}
        </select>
      </label>
      <label className="Field">
        <span>{t('deploy.request')}</span>
        <select className="Input" value={requestId} onChange={(e) => setRequestId(e.target.value)}>
          <option value="">{t('deploy.noRequest')}</option>
          {openRequests.map((r) => <option key={r.id} value={r.id}>{r.company} — {r.position} ({r.store})</option>)}
        </select>
      </label>
      <label className="Field">
        <span>{t('deploy.company')}</span>
        <input name="company" key={`c${requestId}`} defaultValue={request?.company} required />
      </label>
      <label className="Field">
        <span>{t('requests.field.store')}</span>
        <input name="store" key={`s${requestId}`} defaultValue={request ? `${request.store}, ${request.location}` : ''} required />
      </label>
      <label className="Field">
        <span>{t('deploy.startDate')}</span>
        <input name="startDate" type="date" defaultValue={request?.startDate || today()} key={`d${requestId}`} required />
      </label>
      <div className="Form-actions Field--wide">
        <button className="Btn Btn--primary" type="submit">{t('deploy.submit')}</button>
        <button className="Btn Btn--ghost" type="button" onClick={onDone}>{t('portal.cancel')}</button>
      </div>
    </form>
  );
}

function DeploymentCard({ deployment, users, attendance, canManage }) {
  const { t, language } = useI18n();
  const [note, setNote] = useState('');
  const employee = users.find((u) => u.username === deployment.employeeId);
  const entries = monthEntries(attendance, deployment.id);
  const todayEntry = attendance.find((a) => a.deploymentId === deployment.id && a.date === today());
  const enrolled = BENEFITS.filter((b) => deployment.benefits?.[b]).length;

  function addVisit(event) {
    event.preventDefault();
    if (!note.trim()) return;
    update('deployments', deployment.id, {
      visits: [...(deployment.visits || []), { at: new Date().toISOString(), note: note.trim() }],
    });
    setNote('');
  }

  return (
    <article className="Panel">
      <div className="Job-head">
        <div>
          <h3>{employee?.fullName || deployment.employeeId}</h3>
          <p className="Muted">{deployment.company}</p>
        </div>
        <Badge value={deployment.active ? 'active' : 'ended'} label={t(deployment.active ? 'deploy.active' : 'deploy.ended')} />
      </div>
      <p className="Job-meta">
        <span><MapIcon size={16} /> {deployment.store}</span>
        <span><ClockIcon size={16} /> {t('deploy.since', { date: new Date(deployment.startDate).toLocaleDateString(language) })}</span>
        <span>
          {t('deploy.today')}:{' '}
          {todayEntry ? `${todayEntry.timeIn}–${todayEntry.timeOut || t('deploy.onDuty')}` : t('deploy.notIn')}
        </span>
        <span>{t('deploy.monthHours', { h: totalHours(entries).toFixed(1), d: entries.length })}</span>
      </p>

      <fieldset className="Docs">
        <legend><ShieldIcon size={16} /> {t('deploy.benefits')} ({enrolled}/{BENEFITS.length})</legend>
        {BENEFITS.map((b) => (
          <label key={b} className="Check">
            <input
              type="checkbox"
              checked={Boolean(deployment.benefits?.[b])}
              disabled={!canManage}
              onChange={() => update('deployments', deployment.id, { benefits: { ...deployment.benefits, [b]: !deployment.benefits?.[b] } })}
            />
            {t(`deploy.benefit.${b}`)}
          </label>
        ))}
      </fieldset>

      {(canManage || deployment.visits?.length > 0) && (
        <div className="Visits">
          <h4>{t('deploy.visits')}</h4>
          {deployment.visits?.length ? (
            <ul>
              {deployment.visits.slice().reverse().map((v) => (
                <li key={v.at}><small>{new Date(v.at).toLocaleDateString(language)}</small> {v.note}</li>
              ))}
            </ul>
          ) : (
            <p className="Muted Small">{t('deploy.noVisits')}</p>
          )}
          {canManage && deployment.active && (
            <form className="Inline-form" onSubmit={addVisit}>
              <input className="Input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('deploy.visitHint')} aria-label={t('deploy.visits')} />
              <button className="Btn Btn--ghost" type="submit">{t('deploy.addVisit')}</button>
            </form>
          )}
        </div>
      )}

      {canManage && deployment.active && (
        <button className="Btn Btn--ghost" type="button" onClick={() => update('deployments', deployment.id, { active: false })}>
          {t('deploy.end')}
        </button>
      )}
    </article>
  );
}

// Employee view: assignment + time clock. Service: Payroll & timekeeping.
function MyAssignment() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const deployments = useCollection('deployments');
  const attendance = useCollection('attendance');
  const mine = deployments.find((d) => d.employeeId === user.username && d.active);
  const entry = mine && attendance.find((a) => a.deploymentId === mine.id && a.date === today());
  const recent = mine ? attendance.filter((a) => a.deploymentId === mine.id).slice(-7).reverse() : [];

  function clockIn() {
    insert('attendance', { employeeId: user.username, deploymentId: mine.id, date: today(), timeIn: nowTime(), timeOut: '' });
  }

  return (
    <div className="Page">
      <PageHead title={t('deploy.myTitle')} lead={t('deploy.leadEmployee')} mission={t('values.growth.text')} />
      {!mine ? (
        <Empty>{t('deploy.noAssignment')}</Empty>
      ) : (
        <>
          <section className="Panel Clock">
            <div>
              <h2>{mine.company}</h2>
              <p className="Muted"><MapIcon size={16} /> {mine.store}</p>
            </div>
            <div className="Clock-actions">
              <p className="Clock-time">{entry ? `${entry.timeIn} – ${entry.timeOut || '…'}` : '--:--'}</p>
              {!entry && <button className="Btn Btn--primary Btn--lg" type="button" onClick={clockIn}>{t('deploy.timeIn')}</button>}
              {entry && !entry.timeOut && (
                <button className="Btn Btn--primary Btn--lg" type="button" onClick={() => update('attendance', entry.id, { timeOut: nowTime() })}>
                  {t('deploy.timeOut')}
                </button>
              )}
              {entry?.timeOut && <p className="Alert Alert--success">{t('deploy.doneToday')}</p>}
            </div>
          </section>
          <section className="Panel">
            <h2>{t('deploy.recent')}</h2>
            {recent.length === 0 ? (
              <p className="Muted">{t('deploy.noAttendance')}</p>
            ) : (
              <div className="TableWrap">
                <table className="Table">
                  <thead>
                    <tr><th>{t('deploy.date')}</th><th>{t('deploy.timeIn')}</th><th>{t('deploy.timeOut')}</th><th>{t('deploy.hours')}</th></tr>
                  </thead>
                  <tbody>
                    {recent.map((a) => (
                      <tr key={a.id}>
                        <td>{new Date(a.date).toLocaleDateString(language)}</td>
                        <td>{a.timeIn}</td>
                        <td>{a.timeOut || '—'}</td>
                        <td>{hoursWorked(a)?.toFixed(1) ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <section className="Panel">
            <h2><ShieldIcon size={20} /> {t('deploy.benefits')}</h2>
            <ul className="Checklist">
              {BENEFITS.map((b) => (
                <li key={b} className={mine.benefits?.[b] ? 'is-ok' : 'is-pending'}>
                  <CheckIcon size={20} /> {t(`deploy.benefit.${b}`)} — <small>{mine.benefits?.[b] ? t('deploy.enrolled') : t('deploy.processing')}</small>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function DeploymentsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const deployments = useCollection('deployments');
  const attendance = useCollection('attendance');
  const users = useUsers(deployments.length);
  const [params, setParams] = useSearchParams();
  const preselect = params.get('application');
  const [creating, setCreating] = useState(Boolean(preselect));
  const [showEnded, setShowEnded] = useState(false);

  if (user.role === 'applicant') return <MyAssignment />;

  const isAdmin = user.role === 'admin';
  const visible = deployments
    .filter((d) => isAdmin || d.clientId === user.username)
    .filter((d) => showEnded || d.active)
    .slice()
    .reverse();

  return (
    <div className="Page">
      <PageHead
        title={isAdmin ? t('deploy.title') : t('deploy.clientTitle')}
        lead={isAdmin ? t('deploy.leadAdmin') : t('deploy.leadClient')}
        mission={t('values.compliance.text')}
      />
      <div className="Toolbar">
        <label className="Check">
          <input type="checkbox" checked={showEnded} onChange={() => setShowEnded(!showEnded)} /> {t('deploy.showEnded')}
        </label>
        {isAdmin && !creating && (
          <button className="Btn Btn--primary" type="button" onClick={() => setCreating(true)}>+ {t('deploy.new')}</button>
        )}
      </div>
      {isAdmin && creating && (
        <DeployForm
          users={users}
          preselect={preselect}
          onDone={() => {
            setCreating(false);
            setParams({}, { replace: true });
          }}
        />
      )}
      {visible.length === 0 ? (
        <Empty>{isAdmin ? t('deploy.empty') : t('deploy.emptyClient')}</Empty>
      ) : (
        <div className="Cards Cards--2">
          {visible.map((d) => (
            <DeploymentCard key={d.id} deployment={d} users={users} attendance={attendance} canManage={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DeploymentsPage;
