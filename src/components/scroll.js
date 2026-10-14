export function prefersReducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

export function scrollBehavior() {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

export function smoothScrollTo(top) {
  window.scrollTo({ top, behavior: scrollBehavior() });
}
