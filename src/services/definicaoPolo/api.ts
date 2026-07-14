import { requisicaoAutenticada } from '../autenticacao'
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

async function extrairMensagemDeErroDaResposta(
  response: Response,
): Promise<string> {
  try {
    const dados = (await response.json()) as { error?: string; detail?: string }

    if (typeof dados.error === 'string' && dados.error.trim()) {
      return dados.error.trim()
    }

    if (typeof dados.detail === 'string' && dados.detail.trim()) {
      return dados.detail.trim()
    }
  } catch {
    // resposta sem JSON utilizável
  }

  return ''
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
  const response = await requisicaoAutenticada('/api/polos/opcoes-filtro/', {
    method: 'GET',
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroOpcoesFiltroDefinicaoPolos(
      mensagem || 'Não foi possível carregar as opções dos filtros.',
    )
  }

  const opcoes = interpretarOpcoesFiltro(await response.json())

  if (!opcoes) {
    throw new ErroOpcoesFiltroDefinicaoPolos(
      'Resposta de opções de filtro inválida.',
    )
  }

  return opcoes
}

export async function sincronizarUnidadesDiretas(): Promise<ResultadoSincronizacaoUnidadesDiretas> {
  const response = await requisicaoAutenticada('/api/polos/unidades-diretas/', {
    method: 'GET',
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroSincronizacaoUnidadesDiretas(
      mensagem || 'Não foi possível sincronizar as unidades diretas.',
    )
  }

  const dados = (await response.json()) as Record<string, unknown>

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
}

export async function listarDefinicoesPolo({
  pagina = 1,
  tamanhoPagina = 10,
  ...filtros
}: ParametrosListagemDefinicaoPolos = PARAMETROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS): Promise<ListagemDefinicaoPolos> {
  const parametros = new URLSearchParams({
    page: String(pagina),
    pageSize: String(tamanhoPagina),
  })

  if (filtros.dre.trim()) {
    parametros.set('dre', filtros.dre.trim())
  }

  if (filtros.tipoUe.trim()) {
    parametros.set('tipoUe', filtros.tipoUe.trim())
  }

  if (filtros.gestao.trim()) {
    parametros.set('gestao', filtros.gestao.trim())
  }

  if (filtros.tipoPolo.trim()) {
    parametros.set('tipoPolo', filtros.tipoPolo.trim())
  }

  if (filtros.nomeEdicao.trim()) {
    parametros.set('nomeEdicao', filtros.nomeEdicao.trim())
  }

  if (filtros.nomeUeOuCodigoEol.trim()) {
    parametros.set('nomeUeOuCodigoEol', filtros.nomeUeOuCodigoEol.trim())
  }

  const response = await requisicaoAutenticada(
    `/api/polos/?${parametros.toString()}`,
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroListagemDefinicoesPolo(
      mensagem || 'Não foi possível carregar a definição de polos.',
    )
  }

  const dados = await response.json()
  const listagem = interpretarRespostaListagemDefinicoesPolo(dados)

  if (!listagem) {
    throw new ErroListagemDefinicoesPolo('Resposta de listagem inválida.')
  }

  return listagem
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

  const response = await requisicaoAutenticada('/api/polos/atualizacao-lote/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(corpo),
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroAtualizacaoDefinicoesPolo(
      mensagem || 'Não foi possível atualizar os polos selecionados.',
    )
  }

  const dados = (await response.json()) as Record<string, unknown>

  if (typeof dados.totalAtualizados !== 'number') {
    throw new ErroAtualizacaoDefinicoesPolo('Resposta de atualização inválida.')
  }

  return { totalAtualizados: dados.totalAtualizados }
}
