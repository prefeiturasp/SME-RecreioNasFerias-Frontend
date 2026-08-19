import type { PerfilUsuario, SessaoAutenticacao } from './types'

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

export function extrairPerfilUsuario(dados: unknown): PerfilUsuario | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const resposta = dados as Record<string, unknown>
  const rf = resposta.rf
  const nome = resposta.nome
  const descricaoCargo = extrairDescricaoCargo(resposta.cargos)

  if (!textoValido(rf) || !textoValido(nome) || !descricaoCargo) {
    return null
  }

  return {
    rf: rf.trim(),
    nome: nome.trim(),
    descricaoCargo,
  }
}

export function interpretarRespostaLogin(
  dados: unknown,
): SessaoAutenticacao | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const token = (dados as Record<string, unknown>).token
  const perfil = extrairPerfilUsuario(dados)

  if (!textoValido(token) || !perfil) {
    return null
  }

  return { ...perfil, token: token.trim() }
}
