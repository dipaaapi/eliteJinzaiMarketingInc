import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';

function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="AuthPage">
      <div className="AuthCard">
        <h1>404</h1>
        <p>{t('notFound.text')}</p>
        <Link className="Btn Btn--primary" to="/">{t('notFound.home')}</Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
