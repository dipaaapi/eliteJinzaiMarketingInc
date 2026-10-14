import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme';
import { AuthProvider } from './auth/AuthProvider';
import { config } from './config';
import { resetCache, seedJobs } from './data/db';

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  localStorage.setItem('ej-language', 'en');
  resetCache();
  seedJobs();
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

// Clicks an item in the portal sidebar menu.
const menu = (name) =>
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Portal navigation' })).getByRole('link', { name }));

const type = (label, value) =>
  fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });

// Signs in through the account page, then opens `path` from the sidebar.
async function signInAndOpen(username, password, menuLabel) {
  cleanup();
  sessionStorage.clear();
  renderAt('/account');
  type('Username', username);
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: password } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Log In' }).find((b) => b.type === 'submit'));
  await screen.findByText(/Welcome,/);
  if (menuLabel) menu(menuLabel);
}

async function register({ role, name, username, company }) {
  cleanup();
  sessionStorage.clear();
  renderAt('/account?mode=register');
  if (role === 'client') fireEvent.click(screen.getByLabelText(/A client company/));
  type('Full name', name);
  if (company) type('Company / brand', company);
  type('Username', username);
  type('Email', `${username}@example.com`);
  fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'secret123' } });
  type('Confirm password', 'secret123');
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  await screen.findByText(/Welcome,/);
}

test('applicant sees the starter job openings and can apply', async () => {
  await register({ role: 'applicant', name: 'Ana Reyes', username: 'ana' });
  menu('Job openings');
  expect(await screen.findByText('Brand Promoter – Appliances')).toBeInTheDocument();
  expect(screen.getByText('No placement or processing fees, ever.')).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', { name: 'Apply now' })[0]);
  menu('My applications');
  expect(await screen.findByText(/We received your application/)).toBeInTheDocument();
});

test('full service flow: client request → screening → hire → deploy → time clock', async () => {
  // A client asks for staff.
  await register({ role: 'client', name: 'Store Manager', username: 'brandco', company: 'BrandCo Appliances' });
  menu('Manpower requests');
  fireEvent.click(screen.getByRole('button', { name: /Request staff/ }));
  type('Position', 'Brand promoter');
  type('Store / branch', 'Abenson Makati');
  type('Location', 'Makati City');
  type('Number of staff', '1');
  type('Start date', '2026-11-01');
  fireEvent.click(screen.getByRole('button', { name: 'Send request' }));
  expect(await screen.findByText('Brand promoter × 1')).toBeInTheDocument();

  // An applicant applies.
  await register({ role: 'applicant', name: 'Ben Cruz', username: 'ben' });
  menu('Job openings');
  fireEvent.click((await screen.findAllByRole('button', { name: 'Apply now' }))[0]);

  // The recruiter screens: hiring stays blocked until required documents are verified.
  await signInAndOpen(config.demoUser, config.demoPass, 'Applications');
  const card = (await screen.findByText('Ben Cruz')).closest('article');
  fireEvent.click(within(card).getByRole('button', { name: 'Move to Screening' }));
  fireEvent.click(within(card).getByRole('button', { name: 'Move to Interview' }));
  expect(within(card).getByRole('button', { name: 'Move to Hired' })).toBeDisabled();
  expect(within(card).getByText(/4 required document/)).toBeInTheDocument();
  for (const doc of ['Updated resume or biodata', '1–2 valid IDs', 'NBI or police clearance', 'Barangay clearance']) {
    fireEvent.click(within(card).getByLabelText(doc));
  }
  fireEvent.click(within(card).getByRole('button', { name: 'Move to Hired' }));

  // …then deploys the hire against the client's request.
  fireEvent.click(within(card).getByRole('link', { name: /Deploy to a store/ }));
  fireEvent.change(await screen.findByLabelText('Client request'), {
    target: { value: screen.getByRole('option', { name: /BrandCo Appliances/ }).value },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Deploy' }));
  expect(await screen.findByText('Government benefits (0/3)')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('SSS'));
  expect(screen.getByText('Government benefits (1/3)')).toBeInTheDocument();

  // The employee clocks in.
  await signInAndOpen('ben', 'secret123', 'My assignment & time clock');
  fireEvent.click(await screen.findByRole('button', { name: 'Time in' }));
  expect(screen.getByRole('button', { name: 'Time out' })).toBeInTheDocument();

  // The client sees the request filled and the employee on duty.
  await signInAndOpen('brandco', 'secret123', 'Manpower requests');
  expect(await screen.findByText('1 of 1 deployed')).toBeInTheDocument();
  expect(screen.getByText('Filled')).toBeInTheDocument();
  menu('Our deployed staff');
  expect(await screen.findByText(/on duty/)).toBeInTheDocument();
});

test('registration as client requires a company name', async () => {
  renderAt('/account?mode=register');
  fireEvent.click(screen.getByLabelText(/A client company/));
  expect(screen.getByLabelText('Company / brand', { exact: false })).toBeRequired();
});
