import { api } from '../api/http'
import {
  marcarSessaoVerificada,
  sessaoVerificadaRecentemente,
} from './cacheVerificacaoSessao'
import { respostaIndicaSessaoInvalida } from './sessaoInvalida'
import { estaAutenticado } from './storage'

const ENDPOINT_VERIFICACAO_SESSAO = '/api/v1/auth/me/'

export const ROTA_LISTAGEM_EDICOES_PROGRAMA = '/edicoes-programa'

export function deveVerificarSessaoNaRota(pathname: string): boolean {
  if (pathname === '/') return false
  if (pathname === ROTA_LISTAGEM_EDICOES_PROGRAMA) return false

  return estaAutenticado()
}

export async function verificarSessaoAtiva(): Promise<boolean> {
  if (!estaAutenticado()) return false

  if (sessaoVerificadaRecentemente()) {
    return true
  }

  try {
    await api.get(ENDPOINT_VERIFICACAO_SESSAO)
    marcarSessaoVerificada()
    return true
  } catch (error) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown }
    }

    if (
      axiosError.response &&
      respostaIndicaSessaoInvalida(
        axiosError.response.status ?? 0,
        axiosError.response.data,
      )
    ) {
      return false
    }

    return true
  }
}
