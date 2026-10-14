import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/context';
import { smoothScrollTo } from './scroll';

const SHOW_AFTER = 400; // px scrolled before the button appears

// Floating "back to top" button, bottom right. Fades in once the page is scrolled.
function ScrollTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={visible ? 'ScrollTop ScrollTop--visible' : 'ScrollTop'}
      onClick={() => smoothScrollTo(0)}
      aria-label={t('scrollTop')}
      title={t('scrollTop')}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export default ScrollTopButton;
