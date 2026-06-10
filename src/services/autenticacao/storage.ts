import { invalidarCacheVerificacaoSessao } from './cacheVerificacaoSessao'
import type { SessaoAutenticacao } from './types'

const AUTH_SESSION_STORAGE_KEY = 'sme-recreio-auth-session'

export function obterSessaoAutenticacao(): SessaoAutenticacao | null {
  const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const session = JSON.parse(raw) as SessaoAutenticacao
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

export function definirSessaoAutenticacao(session: SessaoAutenticacao): void {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function limparSessaoAutenticacao(): void {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  invalidarCacheVerificacaoSessao()
}

export function obterTokenAutenticacao(): string | null {
  return obterSessaoAutenticacao()?.token ?? null
}

export function estaAutenticado(): boolean {
  return obterTokenAutenticacao() !== null
}
