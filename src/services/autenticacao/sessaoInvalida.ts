import { estaAutenticado, limparSessaoAutenticacao } from './storage'

const ouvintesSessaoInvalida = new Set<() => void>()

export const MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO =
  'Token inválido ou expirado.'

async function corpoIndicaTokenInvalidoOuExpirado(
  response: Response,
): Promise<boolean> {
  try {
    const corpo = await response.clone().text()
    if (!corpo.trim()) {
      return false
    }

    const dados = JSON.parse(corpo) as unknown
    if (!dados || typeof dados !== 'object') {
      return false
    }

    if (
      'detail' in dados &&
      typeof (dados as { detail: unknown }).detail === 'string'
    ) {
      return (
        (dados as { detail: string }).detail ===
        MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO
      )
    }

    return false
  } catch {
    return false
  }
}

export async function respostaIndicaSessaoInvalida(
  response: Response,
): Promise<boolean> {
  if (response.status === 401) {
    return true
  }

  if (response.status === 403) {
    return corpoIndicaTokenInvalidoOuExpirado(response)
  }

  return false
}

export function registrarOuvinteSessaoInvalida(
  ouvinte: () => void,
): () => void {
  ouvintesSessaoInvalida.add(ouvinte)

  return () => {
    ouvintesSessaoInvalida.delete(ouvinte)
  }
}

export function notificarSessaoInvalida(): void {
  if (!estaAutenticado()) return

  limparSessaoAutenticacao()
  ouvintesSessaoInvalida.forEach((ouvinte) => ouvinte())
}
