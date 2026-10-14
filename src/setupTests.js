import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom has no layout engine, so scrolling is stubbed for tests.
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
