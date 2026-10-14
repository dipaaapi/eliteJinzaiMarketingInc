import { useEffect, useState } from 'react';
import { listUsers } from '../auth/authService';
import { useI18n } from '../i18n/context';
import { useCollection } from '../data/db';
import { DEMO_PASSWORD, clearDemoData, loadDemoData } from '../data/demoData';

// Recruiter tool: fill the portal with realistic fake data for demos, or remove it again.
function DemoDataPanel() {
  const { t } = useI18n();
  const jobs = useCollection('jobs');
  const loaded = jobs.some((job) => job.sample);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [examples, setExamples] = useState([]);

  // A few real demo usernames to sign in with (one client, two applicants).
  useEffect(() => {
    listUsers().then((users) => {
      const sample = users.filter((u) => u.sample);
      setExamples([...sample.filter((u) => u.role === 'client').slice(0, 1), ...sample.filter((u) => u.role === 'applicant').slice(0, 2)]);
    });
  }, [loaded, message]);

  async function run(action, done) {
    setBusy(true);
    setMessage('');
    await action();
    setBusy(false);
    setMessage(done);
  }

  return (
    <section className="Panel Demo-panel">
      <h2>{t('demo.title')}</h2>
      <p className="Muted">{t('demo.text')}</p>
      {loaded && (
        <p className="Small">
          {t('demo.accounts')}{' '}
          {examples.map((u, i) => (
            <span key={u.username}>{i > 0 && ', '}<code>{u.username}</code> ({t(`role.${u.role}`)})</span>
          ))}
          {' — '}{t('demo.password')} <code>{DEMO_PASSWORD}</code>
        </p>
      )}
      <div className="Form-actions">
        <button className="Btn Btn--primary" type="button" disabled={busy} onClick={() => run(loadDemoData, t('demo.loaded'))}>
          {busy ? t('demo.working') : loaded ? t('demo.reload') : t('demo.load')}
        </button>
        {loaded && (
          <button className="Btn Btn--ghost" type="button" disabled={busy} onClick={() => run(clearDemoData, t('demo.cleared'))}>
            {t('demo.clear')}
          </button>
        )}
      </div>
      {message && <p className="Alert Alert--success" role="status">{message}</p>}
    </section>
  );
}

export default DemoDataPanel;
