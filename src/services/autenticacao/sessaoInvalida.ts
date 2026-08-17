import { extrairMensagemDeErroDeDados } from '../api/extrairMensagemDeErro'
import { estaAutenticado, limparSessaoAutenticacao } from './storage'

const ouvintesSessaoInvalida = new Set<() => void>()

function mensagemIndicaTokenInvalidoOuExpirado(mensagem: string): boolean {
  const textoNormalizado = mensagem.toLowerCase()
  const mencionaToken =
    textoNormalizado.includes('token') ||
    textoNormalizado.includes('autenticação') ||
    textoNormalizado.includes('autenticacao')
  const indicaInvalidez =
    textoNormalizado.includes('inválido') ||
    textoNormalizado.includes('invalido') ||
    textoNormalizado.includes('invalid') ||
    textoNormalizado.includes('expirado') ||
    textoNormalizado.includes('expired')

  return mencionaToken && indicaInvalidez
}

export function respostaIndicaSessaoInvalida(
  status: number,
  dados: unknown,
): boolean {
  if (status === 401) {
    return true
  }

  if (status !== 403) {
    return false
  }

  const mensagem = extrairMensagemDeErroDeDados(dados)
  return mensagem !== null && mensagemIndicaTokenInvalidoOuExpirado(mensagem)
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
