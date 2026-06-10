import { construirUrlApi } from '../api/construirUrlApi'
import { marcarSessaoVerificada } from './cacheVerificacaoSessao'
import {
  notificarSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'
import { obterTokenAutenticacao } from './storage'

const requisicoesGetEmAndamento = new Map<string, Promise<Response>>()

function chaveRequisicaoGet(path: string): string {
  return `GET ${path}`
}

async function executarRequisicao(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = obterTokenAutenticacao()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(construirUrlApi(path), {
    ...init,
    headers,
  })

  if (respostaIndicaSessaoInvalida(response)) {
    notificarSessaoInvalida()
  } else if (response.ok) {
    marcarSessaoVerificada()
  }

  return response
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
  const requisicaoEmAndamento = requisicoesGetEmAndamento.get(chave)

  if (requisicaoEmAndamento) {
    const response = await requisicaoEmAndamento
    return response.clone()
  }

  const novaRequisicao = executarRequisicao(path, init).finally(() => {
    requisicoesGetEmAndamento.delete(chave)
  })

  requisicoesGetEmAndamento.set(chave, novaRequisicao)

  return novaRequisicao
}
