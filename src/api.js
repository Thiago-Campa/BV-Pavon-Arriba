const TOKEN_KEY = 'admin_token'

export const getToken = () => window.localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => window.localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => window.localStorage.removeItem(TOKEN_KEY)

async function request(url, options = {}) {
  const headers = { ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Ocurrió un error.')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  login: (username, password) =>
    request('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  me: () => request('/api/me'),
  getPhotos: () => request('/api/photos'),
  addPhoto: (formData) => request('/api/photos', { method: 'POST', body: formData }),
  getNews: () => request('/api/news'),
  addNews: (formData) => request('/api/news', { method: 'POST', body: formData }),
}
