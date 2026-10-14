import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollBehavior, smoothScrollTo } from './scroll';

// On navigation: glide to the #section in the URL, or back to the top for a new page.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      smoothScrollTo(0);
      return undefined;
    }
    // Wait a frame so the target page has rendered before looking for the section.
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]); // key: clicking the same link again still scrolls

  return null;
}

export default ScrollManager;
