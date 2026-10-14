import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './i18n';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from './theme';
import { config } from './config';
import { resetCache } from './data/db';

// Each test starts signed out, in English, with no registered accounts.
beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  resetCache();
  localStorage.setItem('ej-language', 'en');
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });
}

async function logIn(username, password) {
  fill('Username', username);
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: password } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Log In' }).find((b) => b.type === 'submit'));
}

test('home page shows company info, services and mission & vision', () => {
  renderAt('/');
  expect(screen.getByRole('heading', { level: 1, name: config.companyName })).toBeInTheDocument();
  expect(screen.getByText('Recruitment & talent sourcing')).toBeInTheDocument();
  expect(screen.getByText('The Mission')).toBeInTheDocument();
  expect(screen.getByText('The Vision')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Field Supervisors' })).toBeInTheDocument();
  expect(screen.getByText('No placement or processing fees, ever.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: config.companyPhones[0] })).toHaveAttribute('href', 'tel:+63288936251');
});

test('dashboard redirects to login when signed out', () => {
  renderAt('/dashboard');
  expect(screen.getByRole('heading', { name: 'Staff log in' })).toBeInTheDocument();
});

test('rejects wrong credentials', async () => {
  renderAt('/account');
  await logIn(config.demoUser, 'definitely-wrong-password');
  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid/i);
});

test('demo admin logs in, sees the recruiter dashboard, and logs out', async () => {
  renderAt('/account');
  await logIn(config.demoUser, config.demoPass);
  expect(await screen.findByText(/Welcome, Administrator/)).toBeInTheDocument();
  expect(screen.getByText('Hiring pipeline')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Log Out' }));
  expect(await screen.findByRole('heading', { name: 'Staff log in' })).toBeInTheDocument();
});

test('registers a new staff account and opens the dashboard', async () => {
  renderAt('/account?mode=register');
  fill('Full name', 'Maria Santos');
  fill('Username', 'maria.s');
  fill('Email', 'maria@example.com');
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'secret123' } });
  fill('Confirm password', 'secret123');
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  expect(await screen.findByText(/Welcome, Maria Santos/)).toBeInTheDocument();
  expect(screen.queryByText('Hiring pipeline')).not.toBeInTheDocument();
});

test('registration rejects mismatched passwords', async () => {
  renderAt('/account?mode=register');
  fill('Full name', 'Juan Cruz');
  fill('Username', 'juan');
  fill('Email', 'juan@example.com');
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'secret123' } });
  fill('Confirm password', 'different1');
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match.');
});

test('switches to Japanese and remembers the choice', () => {
  renderAt('/');
  fireEvent.change(screen.getAllByLabelText('Language')[0], { target: { value: 'ja' } });
  expect(screen.getByText('ミッション')).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('ja');
  expect(localStorage.getItem('ej-language')).toBe('ja');
});

test('theme switcher offers system, light and dark and applies the choice', () => {
  renderAt('/');
  const select = screen.getAllByLabelText('Theme')[0];
  expect([...select.options].map((o) => o.value)).toEqual(['system', 'light', 'dark']);
  fireEvent.change(select, { target: { value: 'dark' } });
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('ej-theme')).toBe('dark');
  fireEvent.change(select, { target: { value: 'light' } });
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('scroll-to-top button appears after scrolling and scrolls up smoothly', () => {
  renderAt('/');
  const button = screen.getByTitle('Back to top');
  expect(button).not.toHaveClass('ScrollTop--visible');
  window.scrollY = 800;
  fireEvent.scroll(window);
  expect(button).toHaveClass('ScrollTop--visible');
  fireEvent.click(button);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' });
});

test('old login, register and settings addresses open the combined account page', () => {
  renderAt('/register');
  expect(screen.getByRole('tab', { name: 'Register' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
});

test('account tabs switch between log in and register on one page', () => {
  renderAt('/account');
  expect(screen.getByRole('heading', { name: 'Staff log in' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
  expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'Log In' }));
  expect(screen.getByRole('heading', { name: 'Staff log in' })).toBeInTheDocument();
});

test('signed-in account page shows profile editing and saves changes', async () => {
  renderAt('/account');
  await logIn(config.demoUser, config.demoPass);
  expect(await screen.findByText(/Welcome, Administrator/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'My account' }));
  expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  fill('Email', 'admin@example.com');
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Saved.');
});

test('Japanese mode translates the address, infographic and admin name', async () => {
  localStorage.setItem('ej-language', 'ja');
  renderAt('/');
  expect(screen.getAllByText(config.companyAddressJa).length).toBeGreaterThan(0);
  expect(screen.queryByText(config.companyAddress)).not.toBeInTheDocument();
  expect(screen.getByText('サービスの仕組み')).toBeInTheDocument();
  expect(document.title).toContain('エリート人材');
});
