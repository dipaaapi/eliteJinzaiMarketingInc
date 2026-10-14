// Browser-only account store for the prototype.
// It keeps the same shape a real backend API would have, so pages won't change when
// this is replaced by fetch() calls. Data lives in this browser only and is NOT secure.
import { config } from '../config';
import { SELF_SERVICE_ROLES } from '../portal/constants';

const USERS_KEY = 'ej-users';
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthError extends Error {
  // `code` is an i18n key, so pages can show it in the current language.
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function loadUsers() {
  try {
    // Accounts made before roles existed were "staff"; they are applicants now.
    return (JSON.parse(localStorage.getItem(USERS_KEY)) || []).map((u) => (u.role === 'staff' ? { ...u, role: 'applicant' } : u));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new AuthError('auth.error.storage');
  }
}

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash: _hash, salt: _salt, ...rest } = user;
  return rest;
}

function findIndex(users, username) {
  const key = username.trim().toLowerCase();
  return users.findIndex((u) => u.username.toLowerCase() === key);
}

function checkPassword(password, confirm) {
  if (password.length < MIN_PASSWORD_LENGTH) throw new AuthError('auth.error.passwordShort');
  if (confirm !== undefined && password !== confirm) throw new AuthError('auth.error.passwordMismatch');
}

// The demo admin always uses the credentials from .env, so it is re-synced on every start.
async function ensureDemoAdmin() {
  const users = loadUsers();
  const index = findIndex(users, config.demoUser);
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(config.demoPass, salt);
  if (index === -1) {
    users.push({
      id: crypto.randomUUID(),
      username: config.demoUser,
      fullName: 'Administrator',
      email: '',
      role: 'admin',
      demo: true,
      createdAt: new Date().toISOString(),
      salt,
      passwordHash,
    });
  } else {
    users[index] = { ...users[index], role: 'admin', demo: true, salt, passwordHash };
  }
  saveUsers(users);
}

let ready;
// Re-seeds the demo admin if site data was cleared while the app was open.
function init() {
  if (!ready || findIndex(loadUsers(), config.demoUser) === -1) ready = ensureDemoAdmin();
  return ready;
}

export async function register({ fullName, username, email, password, confirmPassword, role = 'applicant', company = '' }) {
  await init();
  fullName = fullName.trim();
  username = username.trim();
  email = email.trim();
  if (!fullName || !username) throw new AuthError('auth.error.required');
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) throw new AuthError('auth.error.usernameFormat');
  if (!EMAIL_PATTERN.test(email)) throw new AuthError('auth.error.emailInvalid');
  checkPassword(password, confirmPassword);
  if (!SELF_SERVICE_ROLES.includes(role)) throw new AuthError('auth.error.required');
  company = company.trim();
  if (role === 'client' && !company) throw new AuthError('auth.error.companyRequired');

  const users = loadUsers();
  if (findIndex(users, username) !== -1) throw new AuthError('auth.error.usernameTaken');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new AuthError('auth.error.emailTaken');
  }

  const salt = crypto.randomUUID();
  const user = {
    id: crypto.randomUUID(),
    username,
    fullName,
    email,
    role,
    company: role === 'client' ? company : '',
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  saveUsers([...users, user]);
  return publicUser(user);
}

export async function login(username, password) {
  await init();
  const users = loadUsers();
  const user = users[findIndex(users, username)];
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('auth.error.invalidLogin');
  }
  return publicUser(user);
}

export async function getUser(username) {
  await init();
  const users = loadUsers();
  return publicUser(users[findIndex(users, username)]);
}

export async function listUsers() {
  await init();
  return loadUsers().map(publicUser);
}

export async function updateProfile(username, { fullName, email, phone = '', location = '' }) {
  await init();
  const users = loadUsers();
  const index = findIndex(users, username);
  if (index === -1) throw new AuthError('auth.error.notFound');
  fullName = fullName.trim();
  email = email.trim();
  if (!fullName) throw new AuthError('auth.error.required');
  if (email && !EMAIL_PATTERN.test(email)) throw new AuthError('auth.error.emailInvalid');
  if (email && users.some((u, i) => i !== index && u.email.toLowerCase() === email.toLowerCase())) {
    throw new AuthError('auth.error.emailTaken');
  }
  users[index] = { ...users[index], fullName, email, phone: phone.trim(), location: location.trim() };
  saveUsers(users);
  return publicUser(users[index]);
}

export async function changePassword(username, currentPassword, newPassword, confirmPassword) {
  await init();
  const users = loadUsers();
  const index = findIndex(users, username);
  if (index === -1) throw new AuthError('auth.error.notFound');
  const user = users[index];
  if (user.demo) throw new AuthError('auth.error.demoPassword');
  if ((await hashPassword(currentPassword, user.salt)) !== user.passwordHash) {
    throw new AuthError('auth.error.wrongPassword');
  }
  checkPassword(newPassword, confirmPassword);
  const salt = crypto.randomUUID();
  users[index] = { ...user, salt, passwordHash: await hashPassword(newPassword, salt) };
  saveUsers(users);
}

// ---- Demo data support ----
// Adds sample accounts (marked `sample: true`) that share one password; skips usernames that exist.
export async function addSampleUsers(list, password) {
  await init();
  const users = loadUsers();
  for (const u of list) {
    if (findIndex(users, u.username) !== -1) continue;
    const salt = crypto.randomUUID();
    users.push({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...u, sample: true, salt, passwordHash: await hashPassword(password, salt) });
  }
  saveUsers(users);
}

export async function removeSampleUsers() {
  await init();
  saveUsers(loadUsers().filter((u) => !u.sample));
}
