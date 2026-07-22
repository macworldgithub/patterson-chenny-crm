const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4030/api'

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'API error')
  }
  return res.json()
}