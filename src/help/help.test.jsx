import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import en from './content.en';
import ja from './content.ja';
import App from '../App';
import { LanguageProvider } from '../i18n';
import { ThemeProvider } from '../theme';
import { AuthProvider } from '../auth/AuthProvider';
import { config } from '../config';
import { resetCache } from '../data/db';

// Same keys and the same number of items at every level, so no question is missing in one language.
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])]));
  return typeof value;
}

test('English and Japanese help content have the same structure', () => {
  expect(shape(ja)).toEqual(shape(en));
});

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  localStorage.setItem('ej-language', 'en');
  resetCache();
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

test('public help shows quick-start guides and filters questions by search', () => {
  renderAt('/help');
  expect(screen.getByRole('heading', { name: 'Looking for a job' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Hiring staff for your stores' })).toBeInTheDocument();
  expect(screen.getByText('Do you charge any fees?')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'barangay' } });
  expect(screen.getByText('What are the requirements?')).toBeInTheDocument();
  expect(screen.queryByText('Do you charge any fees?')).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Looking for a job' })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzz' } });
  expect(screen.getByText(/No questions match/)).toBeInTheDocument();
});

test('"Create a client account" preselects the client account type', () => {
  renderAt('/help');
  fireEvent.click(screen.getByRole('link', { name: 'Create a client account' }));
  expect(screen.getByLabelText(/A client company/)).toBeChecked();
});

test('recruiter guide opens first and can switch to the other roles', async () => {
  renderAt('/account');
  fireEvent.change(screen.getByLabelText('Username', { exact: false }), { target: { value: config.demoUser } });
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: config.demoPass } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Log In' }).find((b) => b.type === 'submit'));
  fireEvent.click(await screen.findByRole('link', { name: 'Guide & FAQ' }));
  expect(screen.getByRole('heading', { name: 'Verify documents' })).toBeInTheDocument();
  expect(screen.getByText('Why is “Move to Hired” greyed out?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Client companies' }));
  expect(screen.getByRole('heading', { name: 'Request staff' })).toBeInTheDocument();
});
