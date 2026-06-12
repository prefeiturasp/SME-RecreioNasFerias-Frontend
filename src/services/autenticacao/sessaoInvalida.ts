import { estaAutenticado, limparSessaoAutenticacao } from './storage'

const ouvintesSessaoInvalida = new Set<() => void>()

export function respostaIndicaSessaoInvalida(response: Response): boolean {
  return response.status === 401
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
