// Fake demo data for presentations and testing. Every row is marked `sample: true` so it can be removed
// without touching real records. Names, companies and emails are fictional (emails use example.com).
import { addSampleUsers, removeSampleUsers } from '../auth/authService';
import { insert, list, removeWhere, today, update } from './db';
import { REQUIREMENTS, REQUIRED_FOR_HIRE } from '../portal/constants';

export const DEMO_PASSWORD = 'demo1234';

// Small seeded random generator, so the demo looks the same every time it is loaded.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FIRST = ['Maria', 'Jose', 'Ana', 'Mark', 'Kristine', 'John Paul', 'Angelica', 'Christian', 'Jasmine', 'Rhea', 'Paolo', 'Camille', 'Jerome', 'Patricia', 'Rodel', 'Joy', 'Kevin', 'Shiela', 'Arnel', 'Mae', 'Ramon', 'Liza', 'Noel', 'Grace', 'Dennis', 'Aileen', 'Ryan', 'Clarissa', 'Bryan', 'Hazel', 'Marvin', 'Rowena'];
const LAST = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres', 'Villanueva', 'Ramos', 'Aquino', 'Castillo', 'Navarro', 'Flores', 'Dela Cruz', 'Gonzales', 'Lopez'];
const CITIES = ['Makati City', 'Quezon City', 'Pasig City', 'Taguig City', 'Caloocan City', 'Imus, Cavite', 'Dasmariñas, Cavite', 'Calamba, Laguna', 'San Fernando, Pampanga', 'Malolos, Bulacan', 'Antipolo, Rizal', 'Manila'];

// Fictional client brands (not real companies).
const CLIENTS = [
  { username: 'demo.kaito', fullName: 'Rina Tolentino', company: 'Kaito Electronics Philippines (demo)' },
  { username: 'demo.lumina', fullName: 'Edgar Salonga', company: 'Lumina Home Appliances (demo)' },
  { username: 'demo.northstar', fullName: 'Celia Manalo', company: 'NorthStar Aircon (demo)' },
  { username: 'demo.pinoytech', fullName: 'Victor Dizon', company: 'PinoyTech Gadgets (demo)' },
  { username: 'demo.freshcool', fullName: 'Lorna Pascual', company: 'FreshCool Refrigeration (demo)' },
];
const STORES = ['SM City North EDSA', 'Robinsons Place Imus', 'Waltermart Makati', 'Ayala Malls Manila Bay', 'SM City Calamba', 'Robinsons Galleria', 'Waltermart San Fernando', 'SM Megamall', 'Festival Mall Alabang', 'Vista Mall Taguig'];

const JOBS = [
  ['Brand Promoter – Air Conditioners', 'frontline', 'Metro Manila (NCR)', 8, 'fulltime', 'Explain inverter aircon features to shoppers and close sales. Weekend shifts.'],
  ['Brand Promoter – Refrigerators', 'frontline', 'South Luzon (Cavite, Laguna)', 6, 'fulltime', 'Promote refrigerators and freezers in partner appliance stores.'],
  ['Mobile & Gadgets Promoter', 'frontline', 'Metro Manila (NCR)', 5, 'fulltime', 'Demonstrate phones, tablets and accessories. Product training provided.'],
  ['Retail Support – Inventory', 'frontline', 'Central Luzon (Pampanga, Bulacan)', 4, 'fulltime', 'Stock counts, display upkeep and price tagging.'],
  ['Christmas Season Promoter', 'frontline', 'Metro Manila (NCR)', 12, 'seasonal', 'November–January peak season sales support for home appliances.'],
  ['Recruitment Assistant', 'backoffice', 'Makati head office', 1, 'fulltime', 'Screen applicants, schedule interviews and file documents.'],
  ['Payroll & Timekeeping Clerk', 'backoffice', 'Makati head office', 1, 'fulltime', 'Process attendance, payroll and SSS, PhilHealth and Pag-IBIG contributions.'],
  ['Warehouse Helper – Appliances', 'warehouse', 'Taguig City', 6, 'fulltime', 'Load, unload and inspect appliances. Safety training provided.'],
  ['Part-time Warehouse Helper', 'warehouse', 'Caloocan City', 3, 'parttime', 'Weekend dispatch support during sale events.'],
];

const VISIT_NOTES = [
  'Display complete; product knowledge good.',
  'Sales on target this week. Reminded about uniform.',
  'Store manager happy with performance.',
  'Needs refresher on new inverter models.',
  'Coordinated weekend schedule with the store.',
  'Checked price tags and promo materials.',
];

const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const dateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const time = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

export function hasDemoData() {
  return list('jobs').some((row) => row.sample);
}

export async function clearDemoData() {
  for (const c of ['attendance', 'deployments', 'applications', 'requests', 'jobs']) removeWhere(c, (row) => row.sample);
  await removeSampleUsers();
}

export async function loadDemoData() {
  await clearDemoData();
  const rand = rng(2010);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const int = (min, max) => min + Math.floor(rand() * (max - min + 1));
  const s = { sample: true };

  // Accounts
  const applicants = Array.from({ length: 32 }, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = pick(LAST);
    const username = `demo.${first.toLowerCase().replace(/\s+/g, '')}.${last.toLowerCase().replace(/\s+/g, '')}${i}`;
    return {
      username,
      fullName: `${first} ${last}`,
      email: `${username}@example.com`,
      phone: `+63 9${int(10, 99)} ${int(100, 999)} ${int(1000, 9999)}`,
      location: pick(CITIES),
      role: 'applicant',
      company: '',
      createdAt: daysAgo(int(3, 45)).toISOString(),
    };
  });
  const clients = CLIENTS.map((c) => ({ ...c, email: `${c.username}@example.com`, phone: '+63 2 8000 0000', location: 'Metro Manila', role: 'client', createdAt: daysAgo(int(40, 90)).toISOString() }));
  await addSampleUsers([...clients, ...applicants], DEMO_PASSWORD);

  // Client requests
  const requests = CLIENTS.flatMap((c, ci) =>
    Array.from({ length: ci < 2 ? 2 : 1 }, (_, k) => insert('requests', {
      ...s,
      clientId: c.username,
      company: c.company,
      position: pick(['Brand promoter', 'Product specialist', 'Sales associate', 'Seasonal promoter']),
      category: 'frontline',
      store: STORES[(ci * 2 + k) % STORES.length],
      location: pick(['Metro Manila', 'Cavite', 'Laguna', 'Pampanga']),
      headcount: int(2, 4),
      startDate: dateStr(daysAgo(int(-20, 25))),
      notes: pick(['Weekend shifts, product training on day 1.', 'Christmas sale event support.', 'Must be good with customers; aircon models.', '']),
      status: 'new',
      createdAt: daysAgo(int(5, 30)).toISOString(),
    })));

  // Jobs (two linked to client requests)
  const jobs = JOBS.map(([title, category, location, slots, employmentType, description], i) => insert('jobs', {
    ...s,
    title,
    category,
    location,
    slots,
    employmentType,
    description,
    status: i === 3 ? 'closed' : 'open',
    requestId: i < 2 ? requests[i].id : undefined,
    createdAt: daysAgo(int(10, 40)).toISOString(),
  }));

  // Applications across every stage, with documents that fit the stage.
  const stagePlan = ['hired', 'hired', 'hired', 'hired', 'hired', 'hired', 'hired', 'hired', 'hired', 'interview', 'interview', 'interview', 'interview', 'screening', 'screening', 'screening', 'screening', 'screening', 'applied', 'applied', 'applied', 'applied', 'applied', 'applied', 'rejected', 'rejected', 'rejected'];
  const applications = applicants.slice(0, stagePlan.length).map((a, i) => {
    const stage = stagePlan[i];
    const job = i < 9 ? jobs[i % 3] : pick(jobs);
    const order = ['applied', 'screening', 'interview', 'hired'];
    const reached = stage === 'rejected' ? ['applied', 'screening'] : order.slice(0, order.indexOf(stage) + 1);
    const requirements = Object.fromEntries(REQUIREMENTS.map((key) => {
      if (stage === 'hired') return [key, REQUIRED_FOR_HIRE.includes(key) || rand() < 0.4];
      if (stage === 'interview') return [key, rand() < 0.75];
      if (stage === 'screening') return [key, rand() < 0.4];
      return [key, false];
    }));
    const start = int(6, 30);
    const history = [...reached, ...(stage === 'rejected' ? ['rejected'] : [])].map((st, k) => ({ stage: st, at: daysAgo(start - k * 2).toISOString() }));
    return insert('applications', { ...s, jobId: job.id, applicantId: a.username, stage, requirements, history, createdAt: daysAgo(start).toISOString() });
  });
  // A few people applied to a second job too.
  applicants.slice(27).forEach((a) => insert('applications', { ...s, jobId: pick(jobs).id, applicantId: a.username, stage: 'applied', requirements: {}, history: [], createdAt: daysAgo(int(1, 4)).toISOString() }));

  // Deployments: 8 of the 9 hires (one is waiting for a store), spread over client requests.
  const hired = applications.filter((a) => a.stage === 'hired').slice(0, 8);
  const filled = {};
  const deployments = hired.map((app, i) => {
    const req = requests[i % requests.length];
    filled[req.id] = (filled[req.id] || 0) + 1;
    const benefits = { sss: true, philhealth: i % 3 !== 0, pagibig: i % 4 !== 0 };
    const visits = Array.from({ length: int(0, 3) }, (_, v) => ({ at: daysAgo(v * 4 + 1).toISOString(), note: pick(VISIT_NOTES) })).reverse();
    return insert('deployments', {
      ...s,
      applicationId: app.id,
      employeeId: app.applicantId,
      requestId: req.id,
      clientId: req.clientId,
      company: req.company,
      store: `${req.store}, ${req.location}`,
      startDate: dateStr(daysAgo(int(15, 30))),
      benefits,
      visits,
      active: i !== 7, // one finished assignment
      createdAt: daysAgo(int(15, 30)).toISOString(),
    });
  });
  requests.forEach((req) => {
    const n = filled[req.id] || 0;
    const status = n === 0 ? (rand() < 0.5 ? 'new' : 'sourcing') : n >= req.headcount ? 'filled' : 'partial';
    update('requests', req.id, { status });
  });

  // Two weeks of weekday attendance; some staff already clocked in today.
  deployments.filter((d) => d.active).forEach((d, i) => {
    for (let n = 14; n >= 0; n--) {
      const day = daysAgo(n);
      if (day.getDay() === 0 || (n > 0 && rand() < 0.08)) continue; // Sundays off, occasional absence
      if (n === 0 && i % 3 === 2) continue; // not in yet today
      const timeIn = time(9, int(0, 15));
      const timeOut = n === 0 ? '' : time(18, int(0, 20));
      insert('attendance', { ...s, employeeId: d.employeeId, deploymentId: d.id, date: dateStr(day), timeIn, timeOut });
    }
  });

  return { applicants: applicants.length, clients: clients.length, jobs: jobs.length, deployments: deployments.length, today: today() };
}
