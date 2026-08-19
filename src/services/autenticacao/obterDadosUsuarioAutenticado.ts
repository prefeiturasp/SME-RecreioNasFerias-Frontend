import { api } from '../api/http'
import { extrairPerfilUsuario } from './interpretarRespostaLogin'
import { obterTokenAutenticacao } from './storage'
import type { PerfilUsuario } from './types'

const ROTA_DADOS_USUARIO_AUTENTICADO = '/api/v1/auth/me/'

export async function obterDadosUsuarioAutenticado(): Promise<PerfilUsuario | null> {
  if (obterTokenAutenticacao() === null) {
    return null
  }

  try {
    const { data } = await api.get(ROTA_DADOS_USUARIO_AUTENTICADO)
    return extrairPerfilUsuario(data as unknown)
  } catch {
    return null
  }
}
