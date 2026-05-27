import type { AuthSession } from './types'

const AUTH_SESSION_STORAGE_KEY = 'sme-recreio-auth-session'

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const session = JSON.parse(raw) as AuthSession
    if (
      typeof session.token === 'string' &&
      session.token.trim() &&
      typeof session.rf === 'string' &&
      typeof session.nome === 'string' &&
      typeof session.descricaoCargo === 'string'
    ) {
      return session
    }
  } catch {
    // sessão inválida
  }

  return null
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export function getAuthToken(): string | null {
  return getAuthSession()?.token ?? null
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}
