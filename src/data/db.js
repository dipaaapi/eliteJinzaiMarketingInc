// Browser-only data store for the prototype portal (jobs, applications, requests, deployments, attendance).
// Every read/write goes through here, so it can later be swapped for API calls without touching pages.
import { useSyncExternalStore } from 'react';

const PREFIX = 'ej-db-';
const listeners = new Set();
const cache = new Map();

function read(collection) {
  if (!cache.has(collection)) {
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem(PREFIX + collection)) || [];
    } catch { /* corrupt or blocked storage: start empty */ }
    cache.set(collection, rows);
  }
  return cache.get(collection);
}

function write(collection, rows) {
  cache.set(collection, rows);
  try {
    localStorage.setItem(PREFIX + collection, JSON.stringify(rows));
  } catch { /* storage full or blocked: keep the in-memory copy */ }
  listeners.forEach((notify) => notify());
}

export function list(collection) {
  return read(collection);
}

export function get(collection, id) {
  return read(collection).find((row) => row.id === id) || null;
}

export function insert(collection, data) {
  const now = new Date().toISOString();
  const row = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...data };
  write(collection, [...read(collection), row]);
  return row;
}

export function update(collection, id, changes) {
  let updated = null;
  write(collection, read(collection).map((row) => {
    if (row.id !== id) return row;
    updated = { ...row, ...changes, updatedAt: new Date().toISOString() };
    return updated;
  }));
  return updated;
}

export function removeWhere(collection, predicate) {
  write(collection, read(collection).filter((row) => !predicate(row)));
}

export function remove(collection, id) {
  write(collection, read(collection).filter((row) => row.id !== id));
}

// Clears the in-memory cache (used by tests and after storage is cleared elsewhere).
export function resetCache() {
  cache.clear();
  listeners.forEach((notify) => notify());
}

function subscribe(notify) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

// React hook: re-renders whenever the collection changes.
export function useCollection(collection) {
  return useSyncExternalStore(subscribe, () => read(collection), () => read(collection));
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Starter job openings (from the roles listed on elitejinzai.com) so the portal isn't empty on first run.
export function seedJobs() {
  if (localStorage.getItem(PREFIX + 'seeded')) return;
  const jobs = [
    { title: 'Brand Promoter – Appliances', category: 'frontline', location: 'Metro Manila (NCR)', slots: 10, employmentType: 'fulltime', description: 'Promote and sell home appliances in partner retail stores. Product training provided.' },
    { title: 'Retail Support Staff', category: 'frontline', location: 'South Luzon (Cavite, Laguna)', slots: 6, employmentType: 'fulltime', description: 'Assist customers, maintain displays and support store sales operations.' },
    { title: 'Warehouse Helper', category: 'warehouse', location: 'Metro Manila (NCR)', slots: 4, employmentType: 'seasonal', description: 'Load, unload, inspect and store household and commercial appliances safely.' },
  ];
  jobs.forEach((job) => insert('jobs', { ...job, status: 'open' }));
  try { localStorage.setItem(PREFIX + 'seeded', '1'); } catch { /* ignore */ }
}
