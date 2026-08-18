import { obterSmeIntegracaoApiKey } from '../../config/variaveisAmbiente'
import { apiSmeIntegracao } from '../api/http'
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

export async function listarDresNomeAbreviacao(): Promise<DreNomeAbreviacao[]> {
  if (!obterSmeIntegracaoApiKey()) {
    throw new ErroListagemDresNomeAbreviacao(
      'Chave da API de integração não configurada.',
    )
  }

  try {
    const { data } = await apiSmeIntegracao.get(
      '/api/abrangencia/nome-abreviacao-dres',
    )

    const dres = interpretarRespostaDresNomeAbreviacao(data as unknown)

    if (!dres) {
      throw new ErroListagemDresNomeAbreviacao('Resposta de DREs inválida.')
    }

    return [...dres].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  } catch (error) {
    if (error instanceof ErroListagemDresNomeAbreviacao) {
      throw error
    }

    throw new ErroListagemDresNomeAbreviacao(
      'Não foi possível carregar as DREs.',
    )
  }
}

export async function listarTiposEscolas(): Promise<TipoEscola[]> {
  if (!obterSmeIntegracaoApiKey()) {
    throw new ErroListagemTiposEscolas(
      'Chave da API de integração não configurada.',
    )
  }

  try {
    const { data } = await apiSmeIntegracao.get('/api/escolas/tiposEscolas')

    const tiposEscolas = interpretarRespostaTiposEscolas(data as unknown)

    if (!tiposEscolas) {
      throw new ErroListagemTiposEscolas('Resposta de tipos de UE inválida.')
    }

    return [...tiposEscolas].sort((a, b) =>
      a.descricaoSigla.localeCompare(b.descricaoSigla, 'pt-BR'),
    )
  } catch (error) {
    if (error instanceof ErroListagemTiposEscolas) {
      throw error
    }

    throw new ErroListagemTiposEscolas(
      'Não foi possível carregar os tipos de UE.',
    )
  }
}
