import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarRespostaListagemDefinicoesPolo } from './interpretarRespostaListagemDefinicoesPolo'
import {
  PARAMETROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type ListagemDefinicaoPolos,
  type OpcoesFiltroDefinicaoPolos,
  type ParametrosListagemDefinicaoPolos,
  type ResultadoSincronizacaoUnidadesDiretas,
} from './types'

export class ErroListagemDefinicoesPolo extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_DEFINICOES_POLO_FAILED')
    this.name = 'ErroListagemDefinicoesPolo'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroSincronizacaoUnidadesDiretas extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('SINCRONIZACAO_UNIDADES_DIRETAS_FAILED')
    this.name = 'ErroSincronizacaoUnidadesDiretas'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroAtualizacaoDefinicoesPolo extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('ATUALIZACAO_DEFINICOES_POLO_FAILED')
    this.name = 'ErroAtualizacaoDefinicoesPolo'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroOpcoesFiltroDefinicaoPolos extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('OPCOES_FILTRO_DEFINICAO_POLOS_FAILED')
    this.name = 'ErroOpcoesFiltroDefinicaoPolos'
    this.mensagemUsuario = mensagemUsuario
  }
}

function interpretarOpcoesFiltro(
  dados: unknown,
): OpcoesFiltroDefinicaoPolos | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const resposta = dados as Record<string, unknown>

  if (
    !Array.isArray(resposta.dres) ||
    !Array.isArray(resposta.tiposUe) ||
    !Array.isArray(resposta.gestoes) ||
    !Array.isArray(resposta.nomesEdicao) ||
    !Array.isArray(resposta.tiposPolo)
  ) {
    return null
  }

  const dres = resposta.dres.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  )
  const tiposUe = resposta.tiposUe.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  )
  const gestoes = resposta.gestoes.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  )
  const nomesEdicao = resposta.nomesEdicao.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  )
  const tiposPolo = resposta.tiposPolo.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  )

  return { dres, tiposUe, gestoes, nomesEdicao, tiposPolo }
}

export async function listarOpcoesFiltroDefinicaoPolos(): Promise<OpcoesFiltroDefinicaoPolos> {
  try {
    const { data } = await api.get('/api/polos/opcoes-filtro/')

    const opcoes = interpretarOpcoesFiltro(data as unknown)

    if (!opcoes) {
      throw new ErroOpcoesFiltroDefinicaoPolos(
        'Resposta de opções de filtro inválida.',
      )
    }

    return opcoes
  } catch (error) {
    if (error instanceof ErroOpcoesFiltroDefinicaoPolos) {
      throw error
    }

    throw new ErroOpcoesFiltroDefinicaoPolos(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar as opções dos filtros.',
    )
  }
}

export async function sincronizarUnidadesDiretas(): Promise<ResultadoSincronizacaoUnidadesDiretas> {
  try {
    const { data } = await api.get('/api/polos/unidades-diretas/')

    const dados = data as Record<string, unknown>

    if (
      typeof dados.totalConsultados !== 'number' ||
      typeof dados.totalNovos !== 'number' ||
      typeof dados.totalJaExistentes !== 'number' ||
      !Array.isArray(dados.unidadesNovas) ||
      typeof dados.executada !== 'boolean'
    ) {
      throw new ErroSincronizacaoUnidadesDiretas(
        'Resposta de sincronização inválida.',
      )
    }

    return {
      totalConsultados: dados.totalConsultados,
      totalNovos: dados.totalNovos,
      totalJaExistentes: dados.totalJaExistentes,
      executada: dados.executada,
      motivoIgnorada:
        typeof dados.motivoIgnorada === 'string' ? dados.motivoIgnorada : null,
      ultimaExecucaoEm:
        typeof dados.ultimaExecucaoEm === 'string'
          ? dados.ultimaExecucaoEm
          : null,
    }
  } catch (error) {
    if (error instanceof ErroSincronizacaoUnidadesDiretas) {
      throw error
    }

    throw new ErroSincronizacaoUnidadesDiretas(
      extrairMensagemDeErro(error) ||
        'Não foi possível sincronizar as unidades diretas.',
    )
  }
}

export async function listarDefinicoesPolo({
  pagina = 1,
  tamanhoPagina = 10,
  ...filtros
}: ParametrosListagemDefinicaoPolos = PARAMETROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS): Promise<ListagemDefinicaoPolos> {
  const params: Record<string, string> = {
    page: String(pagina),
    pageSize: String(tamanhoPagina),
  }

  if (filtros.dre.trim()) {
    params.dre = filtros.dre.trim()
  }

  if (filtros.tipoUe.trim()) {
    params.tipoUe = filtros.tipoUe.trim()
  }

  if (filtros.gestao.trim()) {
    params.gestao = filtros.gestao.trim()
  }

  if (filtros.tipoPolo.trim()) {
    params.tipoPolo = filtros.tipoPolo.trim()
  }

  if (filtros.nomeEdicao.trim()) {
    params.nomeEdicao = filtros.nomeEdicao.trim()
  }

  if (filtros.nomeUeOuCodigoEol.trim()) {
    params.nomeUeOuCodigoEol = filtros.nomeUeOuCodigoEol.trim()
  }

  try {
    const { data } = await api.get('/api/polos/', { params })

    const listagem = interpretarRespostaListagemDefinicoesPolo(data as unknown)

    if (!listagem) {
      throw new ErroListagemDefinicoesPolo('Resposta de listagem inválida.')
    }

    return listagem
  } catch (error) {
    if (error instanceof ErroListagemDefinicoesPolo) {
      throw error
    }

    throw new ErroListagemDefinicoesPolo(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar a definição de polos.',
    )
  }
}

export type ParametrosAtualizacaoDefinicoesPoloEmLote = {
  ids: string[]
  nomeEdicao?: string
  tipo?: string
}

export type ResultadoAtualizacaoDefinicoesPoloEmLote = {
  totalAtualizados: number
}

export async function atualizarDefinicoesPoloEmLote({
  ids,
  nomeEdicao,
  tipo,
}: ParametrosAtualizacaoDefinicoesPoloEmLote): Promise<ResultadoAtualizacaoDefinicoesPoloEmLote> {
  const corpo: Record<string, unknown> = { ids }

  if (nomeEdicao !== undefined) {
    corpo.nomeEdicao = nomeEdicao
  }

  if (tipo !== undefined) {
    corpo.tipo = tipo
  }

  try {
    const { data } = await api.patch('/api/polos/atualizacao-lote/', corpo)

    const dados = data as Record<string, unknown>

    if (typeof dados.totalAtualizados !== 'number') {
      throw new ErroAtualizacaoDefinicoesPolo(
        'Resposta de atualização inválida.',
      )
    }

    return { totalAtualizados: dados.totalAtualizados }
  } catch (error) {
    if (error instanceof ErroAtualizacaoDefinicoesPolo) {
      throw error
    }

    throw new ErroAtualizacaoDefinicoesPolo(
      extrairMensagemDeErro(error) ||
        'Não foi possível atualizar os polos selecionados.',
    )
  }
}
