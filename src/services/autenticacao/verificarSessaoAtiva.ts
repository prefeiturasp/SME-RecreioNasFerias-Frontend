import {
  marcarSessaoVerificada,
  sessaoVerificadaRecentemente,
} from './cacheVerificacaoSessao'
import { requisicaoAutenticada } from './requisicaoAutenticada'
import { respostaIndicaSessaoInvalida } from './sessaoInvalida'
import { estaAutenticado } from './storage'

const ENDPOINT_VERIFICACAO_SESSAO = '/api/edicoes/'

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
    const response = await requisicaoAutenticada(ENDPOINT_VERIFICACAO_SESSAO, {
      method: 'GET',
    })

    if (await respostaIndicaSessaoInvalida(response)) {
      return false
    }

    marcarSessaoVerificada()
    return true
  } catch {
    return true
  }
}
