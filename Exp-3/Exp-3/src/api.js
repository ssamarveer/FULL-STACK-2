export const API = 'http://localhost:5050/api'
export async function api(path, options = {}) {
  const token = localStorage.getItem('post_composer_jwt')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(API + path, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}
