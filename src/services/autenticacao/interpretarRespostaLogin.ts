import type { SessaoAutenticacao } from './types'

function textoValido(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim().length > 0
}

function extrairDescricaoCargo(cargos: unknown): string | null {
  if (!Array.isArray(cargos) || cargos.length === 0) {
    return null
  }

  const primeiroCargo = cargos[0]
  if (!primeiroCargo || typeof primeiroCargo !== 'object') {
    return null
  }

  const descricao = (primeiroCargo as { descricaoCargo?: unknown })
    .descricaoCargo
  return textoValido(descricao) ? descricao.trim() : null
}

export function interpretarRespostaLogin(
  dados: unknown,
): SessaoAutenticacao | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const resposta = dados as Record<string, unknown>
  const token = resposta.token
  const rf = resposta.rf
  const nome = resposta.nome
  const descricaoCargo = extrairDescricaoCargo(resposta.cargos)

  if (
    !textoValido(token) ||
    !textoValido(rf) ||
    !textoValido(nome) ||
    !descricaoCargo
  ) {
    return null
  }

  return {
    token: token.trim(),
    rf: rf.trim(),
    nome: nome.trim(),
    descricaoCargo,
  }
}
