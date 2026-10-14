import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, displayName } from '../auth/context';
import { LanguageSwitcher } from '../i18n';
import { useI18n } from '../i18n/context';
import { ThemeSwitcher } from '../theme';

// Runs an async form action and keeps its result as an i18n message key.
function useFormStatus() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  async function run(action, successKey) {
    setStatus(null);
    setBusy(true);
    try {
      await action();
      if (successKey) setStatus({ type: 'success', key: successKey });
      return true;
    } catch (err) {
      setStatus({ type: 'error', key: err.code || 'auth.error.unknown' });
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { status, busy, run };
}

function Status({ status }) {
  const { t } = useI18n();
  if (!status) return null;
  return (
    <p className={`Alert Alert--${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
      {t(status.key)}
    </p>
  );
}

function LoginForm() {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, busy, run } = useFormStatus();

  async function handleSubmit(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    const ok = await run(() => signIn(f.username.value.trim(), f.password.value));
    if (ok) navigate(location.state?.from || '/dashboard', { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="account-title">
      <h1 id="account-title">{t('login.title')}</h1>
      <p className="Muted">{t('login.subtitle')}</p>
      <label className="Field">
        <span>{t('field.username')}</span>
        <input name="username" autoComplete="username" required />
      </label>
      <label className="Field">
        <span>{t('field.password')}</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <Status status={status} />
      <button className="Btn Btn--primary Btn--block" type="submit" disabled={busy}>
        {t('login.submit')}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { t } = useI18n();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { status, busy, run } = useFormStatus();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('type') === 'client' ? 'client' : 'applicant');

  async function handleSubmit(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    const ok = await run(() => signUp({
      fullName: f.fullName.value,
      username: f.username.value,
      email: f.email.value,
      password: f.password.value,
      confirmPassword: f.confirmPassword.value,
      role,
      company: f.company?.value || '',
    }));
    if (ok) navigate('/dashboard', { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="account-title">
      <h1 id="account-title">{t('register.title')}</h1>
      <p className="Muted">{t('register.subtitle')}</p>
      <fieldset className="Roles">
        <legend>{t('register.accountType')}</legend>
        {['applicant', 'client'].map((r) => (
          <label key={r} className={role === r ? 'Role Role--on' : 'Role'}>
            <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} />
            <strong>{t(`register.role.${r}`)}</strong>
            <small>{t(`register.role.${r}Hint`)}</small>
          </label>
        ))}
      </fieldset>
      <label className="Field">
        <span>{t('field.fullName')}</span>
        <input name="fullName" autoComplete="name" required />
      </label>
      {role === 'client' && (
        <label className="Field">
          <span>{t('field.company')}</span>
          <input name="company" autoComplete="organization" required />
        </label>
      )}
      <label className="Field">
        <span>{t('field.username')}</span>
        <input name="username" autoComplete="username" required minLength={3} maxLength={30} />
        <small>{t('register.usernameHint')}</small>
      </label>
      <label className="Field">
        <span>{t('field.email')}</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="Field">
        <span>{t('field.password')}</span>
        <input name="password" type="password" autoComplete="new-password" required minLength={8} />
        <small>{t('register.passwordHint')}</small>
      </label>
      <label className="Field">
        <span>{t('field.confirmPassword')}</span>
        <input name="confirmPassword" type="password" autoComplete="new-password" required />
      </label>
      <Status status={status} />
      <button className="Btn Btn--primary Btn--block" type="submit" disabled={busy}>
        {t('register.submit')}
      </button>
    </form>
  );
}

// Signed out: one card with "Log in" and "Register" tabs (?mode=register selects the second).
function SignedOut() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'register' ? 'register' : 'login';
  const select = (next) => setParams(next === 'register' ? { mode: next } : {}, { replace: true });

  return (
    <section className="AuthPage">
      <div className="AuthCard">
        <div className="Tabs" role="tablist" aria-label={t('account.title')}>
          {['login', 'register'].map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`tab-${name}`}
              aria-selected={mode === name}
              aria-controls="account-panel"
              className={mode === name ? 'Tab Tab--active' : 'Tab'}
              onClick={() => select(name)}
            >
              {t(name === 'login' ? 'nav.login' : 'nav.register')}
            </button>
          ))}
          <span className={`Tabs-ink Tabs-ink--${mode}`} aria-hidden="true" />
        </div>
        <div id="account-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} key={mode} className="Tab-panel">
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
        <p className="AuthCard-foot">
          {mode === 'login' ? t('login.noAccount') : t('register.haveAccount')}{' '}
          <button type="button" className="Linkish" onClick={() => select(mode === 'login' ? 'register' : 'login')}>
            {t(mode === 'login' ? 'nav.register' : 'nav.login')}
          </button>
        </p>
      </div>
    </section>
  );
}

// Signed in: profile, password and preferences on the same page.
function SignedIn() {
  const { t } = useI18n();
  const { user, updateProfile, changePassword, signOut } = useAuth();
  const profile = useFormStatus();
  const password = useFormStatus();
  const name = displayName(user, t);
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  function saveProfile(event) {
    event.preventDefault();
    const f = event.currentTarget.elements;
    profile.run(() => updateProfile({ fullName: f.fullName.value, email: f.email.value, phone: f.phone.value, location: f.location.value }), 'settings.saved');
  }

  async function savePassword(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const f = form.elements;
    const ok = await password.run(
      () => changePassword(f.currentPassword.value, f.newPassword.value, f.confirmPassword.value),
      'settings.saved'
    );
    if (ok) form.reset();
  }

  return (
    <section className="Section Account">
      <header className="Account-head">
        <span className="Avatar" aria-hidden="true">{initials}</span>
        <div>
          <h1 id="account-title">{name}</h1>
          <p className="Muted">{t(`role.${user.role}`)} · {user.username}</p>
        </div>
        <div className="Account-actions">
          <Link className="Btn Btn--primary" to="/dashboard">{t('nav.dashboard')}</Link>
          <button type="button" className="Btn Btn--ghost" onClick={signOut}>{t('nav.logout')}</button>
        </div>
      </header>

      <div className="Account-grid">
        <section className="Panel">
          <h2>{t('settings.profile')}</h2>
          <form className="Form" onSubmit={saveProfile}>
            <label className="Field">
              <span>{t('field.username')}</span>
              <input value={user.username} disabled />
            </label>
            <label className="Field">
              <span>{t('field.fullName')}</span>
              <input name="fullName" defaultValue={name} required />
            </label>
            <label className="Field">
              <span>{t('field.email')}</span>
              <input name="email" type="email" defaultValue={user.email} />
            </label>
            <label className="Field">
              <span>{t('field.phone')}</span>
              <input name="phone" type="tel" autoComplete="tel" defaultValue={user.phone} />
            </label>
            <label className="Field">
              <span>{t('field.location')}</span>
              <input name="location" autoComplete="address-level2" defaultValue={user.location} />
            </label>
            <Status status={profile.status} />
            <button className="Btn Btn--primary" type="submit" disabled={profile.busy}>{t('settings.save')}</button>
          </form>
        </section>

        <section className="Panel">
          <h2>{t('settings.password')}</h2>
          {user.demo ? (
            <p className="Muted">{t('auth.error.demoPassword')}</p>
          ) : (
            <form className="Form" onSubmit={savePassword}>
              <label className="Field">
                <span>{t('settings.currentPassword')}</span>
                <input name="currentPassword" type="password" autoComplete="current-password" required />
              </label>
              <label className="Field">
                <span>{t('settings.newPassword')}</span>
                <input name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
              </label>
              <label className="Field">
                <span>{t('field.confirmPassword')}</span>
                <input name="confirmPassword" type="password" autoComplete="new-password" required />
              </label>
              <Status status={password.status} />
              <button className="Btn Btn--primary" type="submit" disabled={password.busy}>{t('settings.changePassword')}</button>
            </form>
          )}
        </section>

        <section className="Panel">
          <h2>{t('account.preferences')}</h2>
          <div className="Prefs">
            <label className="Field">
              <span>{t('settings.language')}</span>
              <LanguageSwitcher />
              <small>{t('settings.languageHint')}</small>
            </label>
            <label className="Field">
              <span>{t('theme.label')}</span>
              <ThemeSwitcher />
              <small>{t('settings.themeHint')}</small>
            </label>
          </div>
        </section>
      </div>
    </section>
  );
}

function AccountPage() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <SignedIn /> : <SignedOut />;
}

export default AccountPage;
