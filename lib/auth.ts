export function setAuthToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
}

export function clearAuthToken() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return document.cookie.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]
}