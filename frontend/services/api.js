export const API_BASE = process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://smart-task-manager-3-b0o4.onrender.com/api');

export function getStoredUser() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem('smart-task-user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('smart-task-user', JSON.stringify(user));
  }
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('smart-task-user');
}

export function getAuthHeaders() {
  const user = getStoredUser();
  return user ? { 'x-user-id': user.id } : {};
}

export async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    throw new Error('Backend API is not configured. Set NEXT_PUBLIC_API_URL to your deployed backend URL, ending in /api.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error('Could not reach the backend API. Check that the backend is deployed and NEXT_PUBLIC_API_URL is correct.');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
