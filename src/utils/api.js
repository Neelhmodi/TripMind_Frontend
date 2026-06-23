const API_BASE = '/api/v1';

function extractErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (typeof error.detail === 'string') return error.detail;
  if (Array.isArray(error.detail)) {
    return error.detail.map(e => e.msg || JSON.stringify(e)).join(', ');
  }
  if (typeof error.detail === 'object') return JSON.stringify(error.detail);
  return error.message || `HTTP error ${error.status}`;
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('tm_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(extractErrorMessage(error));
  }
  return response.json();
}

// ── Flight search ─────────────────────────────────────────────────────────────
export async function searchFlightsForm(formData) {
  return apiFetch('/flights/search/form', { method: 'POST', body: JSON.stringify(formData) });
}

export async function searchFlightsNLP(message) {
  return apiFetch('/flights/search/nlp', { method: 'POST', body: JSON.stringify({ message }) });
}

// ── Hotel search ──────────────────────────────────────────────────────────────
export async function searchHotelsForm(formData) {
  return apiFetch('/hotels/search/form', { method: 'POST', body: JSON.stringify(formData) });
}

export async function searchHotelsNLP(message) {
  return apiFetch('/hotels/search/nlp', { method: 'POST', body: JSON.stringify({ message }) });
}

export async function lookupIATA(city) {
  try {
    return await apiFetch(`/flights/iata/${encodeURIComponent(city)}`);
  } catch { return null; }
}

export async function fetchAirlines() {
  try {
    return await apiFetch('/flights/airlines');
  } catch { return { airlines: [] }; }
}

export async function checkHealth() {
  try {
    return await apiFetch('/health');
  } catch { return null; }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function register(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem('tm_token', data.token);
  localStorage.setItem('tm_user', JSON.stringify(data.user));
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('tm_token', data.token);
  localStorage.setItem('tm_user', JSON.stringify(data.user));
  return data;
}

export async function getMe() {
  return apiFetch('/auth/me');
}

export function logout() {
  localStorage.removeItem('tm_token');
  localStorage.removeItem('tm_user');
}

export function getStoredUser() {
  try {
    const u = localStorage.getItem('tm_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

export function isLoggedIn() {
  return !!localStorage.getItem('tm_token');
}