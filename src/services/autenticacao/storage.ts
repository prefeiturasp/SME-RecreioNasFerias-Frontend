import { invalidarCacheVerificacaoSessao } from './cacheVerificacaoSessao'
import type { PerfilUsuario, SessaoAutenticacao } from './types'

const AUTH_SESSION_STORAGE_KEY = 'sme-recreio-auth-session'

let tokenAutenticacaoEmMemoria: string | null = null

function validarPerfilUsuario(dados: unknown): PerfilUsuario | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const perfil = dados as Partial<PerfilUsuario>

  if (
    typeof perfil.rf === 'string' &&
    perfil.rf.trim() &&
    typeof perfil.nome === 'string' &&
    perfil.nome.trim() &&
    typeof perfil.descricaoCargo === 'string' &&
    perfil.descricaoCargo.trim()
  ) {
    return {
      rf: perfil.rf.trim(),
      nome: perfil.nome.trim(),
      descricaoCargo: perfil.descricaoCargo.trim(),
    }
  }

  return null
}

export function obterPerfilUsuario(): PerfilUsuario | null {
  const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return validarPerfilUsuario(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export function definirPerfilUsuario(perfil: PerfilUsuario): void {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(perfil))
}

export function obterTokenAutenticacao(): string | null {
  return tokenAutenticacaoEmMemoria
}

export function definirTokenAutenticacao(token: string): void {
  tokenAutenticacaoEmMemoria = token
}

export function definirSessaoAutenticacao(session: SessaoAutenticacao): void {
  tokenAutenticacaoEmMemoria = session.token
  definirPerfilUsuario({
    rf: session.rf,
    nome: session.nome,
    descricaoCargo: session.descricaoCargo,
  })
}

export function obterSessaoAutenticacao(): SessaoAutenticacao | null {
  if (tokenAutenticacaoEmMemoria === null) {
    return null
  }

  const perfil = obterPerfilUsuario()
  if (!perfil) {
    return null
  }

  return { ...perfil, token: tokenAutenticacaoEmMemoria }
}

export function limparSessaoAutenticacao(): void {
  tokenAutenticacaoEmMemoria = null
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  invalidarCacheVerificacaoSessao()
}

export function estaAutenticado(): boolean {
  return tokenAutenticacaoEmMemoria !== null
}
