import { construirUrlApi } from '../api/construirUrlApi'
import { marcarSessaoVerificada } from './cacheVerificacaoSessao'
import {
  notificarSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'
import { obterTokenAutenticacao } from './storage'

type RequisicaoGetEmAndamento = {
  promessa: Promise<Response>
}

const requisicoesGetEmAndamento = new Map<string, RequisicaoGetEmAndamento>()

function chaveRequisicaoGet(path: string): string {
  return `GET ${path}`
}

async function executarRequisicao(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = obterTokenAutenticacao()

  if (token !== null && token.length > 0) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(construirUrlApi(path), {
    ...init,
    headers,
  })

  if (await respostaIndicaSessaoInvalida(response)) {
    notificarSessaoInvalida()
  } else if (response.ok) {
    marcarSessaoVerificada()
  }

  return response
}

async function aguardarRequisicaoGetEmAndamento(
  chave: string,
): Promise<Response> {
  const requisicaoEmAndamento = requisicoesGetEmAndamento.get(chave)

  if (requisicaoEmAndamento === undefined) {
    throw new Error(`Requisição GET em andamento não encontrada: ${chave}`)
  }

  const response = await requisicaoEmAndamento.promessa
  return response.clone()
}

export async function requisicaoAutenticada(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const metodo = (init.method ?? 'GET').toUpperCase()

  if (metodo !== 'GET') {
    return executarRequisicao(path, init)
  }

  const chave = chaveRequisicaoGet(path)

  if (requisicoesGetEmAndamento.has(chave)) {
    return aguardarRequisicaoGetEmAndamento(chave)
  }

  const promessa = executarRequisicao(path, init).finally(() => {
    requisicoesGetEmAndamento.delete(chave)
  })

  requisicoesGetEmAndamento.set(chave, { promessa })

  return promessa
}
