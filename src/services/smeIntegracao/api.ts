import { construirUrlSmeIntegracaoApi } from './construirUrlSmeIntegracaoApi'
import { interpretarRespostaDresNomeAbreviacao } from './interpretarRespostaDresNomeAbreviacao'
import { interpretarRespostaTiposEscolas } from './interpretarRespostaTiposEscolas'
import type { DreNomeAbreviacao, TipoEscola } from './types'

export class ErroListagemDresNomeAbreviacao extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_DRES_NOME_ABREVIACAO_FAILED')
    this.name = 'ErroListagemDresNomeAbreviacao'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroListagemTiposEscolas extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_TIPOS_ESCOLAS_FAILED')
    this.name = 'ErroListagemTiposEscolas'
    this.mensagemUsuario = mensagemUsuario
  }
}

function obterChaveApiSmeIntegracao(): string {
  return (import.meta.env.VITE_SME_INTEGRACAO_API_KEY ?? '').trim()
}

export async function listarDresNomeAbreviacao(): Promise<DreNomeAbreviacao[]> {
  const chaveApi = obterChaveApiSmeIntegracao()

  if (!chaveApi) {
    throw new ErroListagemDresNomeAbreviacao(
      'Chave da API de integração não configurada.',
    )
  }

  const response = await fetch(
    construirUrlSmeIntegracaoApi('/api/abrangencia/nome-abreviacao-dres'),
    {
      method: 'GET',
      headers: {
        'x-api-eol-key': chaveApi,
      },
    },
  )

  if (!response.ok) {
    throw new ErroListagemDresNomeAbreviacao(
      'Não foi possível carregar as DREs.',
    )
  }

  const dados = await response.json()
  const dres = interpretarRespostaDresNomeAbreviacao(dados)

  if (!dres) {
    throw new ErroListagemDresNomeAbreviacao('Resposta de DREs inválida.')
  }

  return [...dres].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

export async function listarTiposEscolas(): Promise<TipoEscola[]> {
  const chaveApi = obterChaveApiSmeIntegracao()

  if (!chaveApi) {
    throw new ErroListagemTiposEscolas(
      'Chave da API de integração não configurada.',
    )
  }

  const response = await fetch(
    construirUrlSmeIntegracaoApi('/api/escolas/tiposEscolas'),
    {
      method: 'GET',
      headers: {
        'x-api-eol-key': chaveApi,
      },
    },
  )

  if (!response.ok) {
    throw new ErroListagemTiposEscolas(
      'Não foi possível carregar os tipos de UE.',
    )
  }

  const dados = await response.json()
  const tiposEscolas = interpretarRespostaTiposEscolas(dados)

  if (!tiposEscolas) {
    throw new ErroListagemTiposEscolas('Resposta de tipos de UE inválida.')
  }

  return [...tiposEscolas].sort((a, b) =>
    a.descricaoSigla.localeCompare(b.descricaoSigla, 'pt-BR'),
  )
}
