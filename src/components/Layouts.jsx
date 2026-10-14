import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { config, companyAddress } from '../config';
import { useAuth, displayName } from '../auth/context';
import { LanguageSwitcher } from '../i18n';
import { useI18n } from '../i18n/context';
import { ThemeSwitcher } from '../theme';
import Logo from './Logo';

// Portal menu per role: [path, i18n key].
const MENU = {
  admin: [['/dashboard', 'nav.dashboard'], ['/jobs', 'nav.jobs'], ['/applications', 'nav.applications'], ['/requests', 'nav.requests'], ['/deployments', 'nav.deployments'], ['/guide', 'nav.guide']],
  applicant: [['/dashboard', 'nav.dashboard'], ['/jobs', 'nav.jobs'], ['/applications', 'nav.myApplications'], ['/deployments', 'nav.myAssignment'], ['/guide', 'nav.guide']],
  client: [['/dashboard', 'nav.dashboard'], ['/requests', 'nav.requests'], ['/deployments', 'nav.myStaff'], ['/guide', 'nav.guide']],
};

export function PublicLayout() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="Site">
      <header className="Topbar">
        <Link to="/" className="Brand">
          <Logo height={44} />
        </Link>
        <nav className="Topbar-nav" aria-label={t('nav.main')}>
          <Link to="/#about">{t('nav.about')}</Link>
          <Link to="/#services">{t('nav.services')}</Link>
          <Link to="/#mission">{t('nav.mission')}</Link>
          <Link to="/#team">{t('nav.team')}</Link>
          <Link to="/#careers">{t('nav.careers')}</Link>
          <Link to="/#contact">{t('nav.contact')}</Link>
          <NavLink to="/help">{t('nav.help')}</NavLink>
        </nav>
        <div className="Topbar-actions">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {user ? (
            <>
              <Link className="Btn Btn--ghost" to="/account">{t('nav.account')}</Link>
              <Link className="Btn Btn--primary" to="/dashboard">{t('nav.dashboard')}</Link>
            </>
          ) : (
            <>
              <Link className="Btn Btn--ghost" to="/account">{t('nav.login')}</Link>
              <Link className="Btn Btn--primary" to="/account?mode=register">{t('nav.register')}</Link>
            </>
          )}
        </div>
      </header>
      <main key={pathname} className="Page-enter">
        <Outlet />
      </main>
      <footer className="Footer">
        <p>© {new Date().getFullYear()} {config.companyName}</p>
        <p>{companyAddress(language)}</p>
        <p><Link className="Footer-link" to="/help">{t('nav.help')}</Link></p>
      </footer>
    </div>
  );
}

export function AppLayout() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="Shell">
      <aside className="Sidebar">
        <Link to="/" className="Brand Brand--light">
          <Logo height={40} />
        </Link>
        <nav className="Sidebar-nav" aria-label={t('nav.app')}>
          {(MENU[user.role] || MENU.applicant).map(([to, key]) => (
            <NavLink key={to} to={to} end>{t(key)}</NavLink>
          ))}
          <NavLink to="/account">{t('nav.account')}</NavLink>
          <Link to="/">{t('nav.website')}</Link>
        </nav>
        <div className="Sidebar-foot">
          <p className="Sidebar-user">
            {displayName(user, t)}
            <small>{t(`role.${user.role}`)}</small>
          </p>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button type="button" className="Btn Btn--ghost-light" onClick={signOut}>
            {t('nav.logout')}
          </button>
        </div>
      </aside>
      <main key={pathname} className="Shell-main Page-enter">
        <Outlet />
      </main>
    </div>
  );
}
