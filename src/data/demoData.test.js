import { insert, list, resetCache } from './db';
import { DEMO_PASSWORD, clearDemoData, hasDemoData, loadDemoData } from './demoData';
import { listUsers, login } from '../auth/authService';
import { STAGES, missingRequirements } from '../portal/constants';

beforeEach(() => {
  localStorage.clear();
  resetCache();
});

test('demo data covers every stage and keeps hires compliant', async () => {
  await loadDemoData();
  expect(hasDemoData()).toBe(true);

  const applications = list('applications');
  for (const stage of STAGES) expect(applications.some((a) => a.stage === stage)).toBe(true);
  // The rule "documents verified before hiring" holds for the fake data too.
  expect(applications.filter((a) => a.stage === 'hired').every((a) => missingRequirements(a).length === 0)).toBe(true);

  const requestStatuses = new Set(list('requests').map((r) => r.status));
  expect(requestStatuses.has('partial') || requestStatuses.has('filled')).toBe(true);
  expect(list('deployments').length).toBeGreaterThan(5);
  expect(list('attendance').length).toBeGreaterThan(30);

  const users = await listUsers();
  expect(users.filter((u) => u.sample && u.role === 'client')).toHaveLength(5);
  expect(users.filter((u) => u.sample && u.role === 'applicant')).toHaveLength(32);
  expect(users.filter((u) => u.sample).every((u) => u.email.endsWith('@example.com'))).toBe(true);
  await expect(login('demo.kaito', DEMO_PASSWORD)).resolves.toMatchObject({ role: 'client' });
});

test('loading twice does not duplicate, and clearing keeps real records', async () => {
  await loadDemoData();
  const firstCount = list('applications').length;
  await loadDemoData();
  expect(list('applications')).toHaveLength(firstCount);

  const real = insert('jobs', { title: 'Real job', category: 'frontline', location: 'Makati', slots: 1, employmentType: 'fulltime', status: 'open' });
  await clearDemoData();
  expect(hasDemoData()).toBe(false);
  expect(list('jobs').map((j) => j.id)).toEqual([real.id]);
  expect((await listUsers()).some((u) => u.sample)).toBe(false);
});
