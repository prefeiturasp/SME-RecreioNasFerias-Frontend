import { requisicaoAutenticada } from '../autenticacao'
import {
  interpretarRespostaEdicaoPrograma,
  interpretarRespostaListagemEdicoesPaginada,
} from './interpretarRespostaListagemEdicoes'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from './mocks'
import type {
  DadosCadastroEdicaoPrograma,
  EdicaoPrograma,
  ListagemEdicoesPrograma,
  ParametrosListagemEdicoesPrograma,
} from './types'

export class ErroListagemEdicoesPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_EDICOES_FAILED')
    this.name = 'ErroListagemEdicoesPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroCadastroEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('CADASTRO_EDICAO_FAILED')
    this.name = 'ErroCadastroEdicaoPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroAtualizacaoEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('ATUALIZACAO_EDICAO_FAILED')
    this.name = 'ErroAtualizacaoEdicaoPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

function montarPayloadEdicao(dados: DadosCadastroEdicaoPrograma) {
  return {
    nome: dados.nome,
    periodoEdicao: {
      de: dados.dataInicioEdicao,
      ate: dados.dataFimEdicao,
    },
    periodoInscricoes: {
      de: dados.dataInicioInscricoes,
      ate: dados.dataFimInscricoes,
    },
    ...QUANTIDADES_MOCK_CADASTRO_EDICAO,
  }
}

async function extrairMensagemDeErroDaResposta(
  response: Response,
): Promise<string> {
  const corpo = await response.text()
  if (!corpo.trim()) {
    return ''
  }

  try {
    const dados = JSON.parse(corpo) as unknown
    if (dados && typeof dados === 'object') {
      if (
        'error' in dados &&
        typeof (dados as { error: unknown }).error === 'string'
      ) {
        return (dados as { error: string }).error
      }

      if (
        'detail' in dados &&
        typeof (dados as { detail: unknown }).detail === 'string'
      ) {
        return (dados as { detail: string }).detail
      }
    }
  } catch {
    // corpo não é JSON; exibe o texto bruto retornado pelo backend
  }

  return corpo
}

export async function cadastrarEdicaoPrograma(
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  const response = await requisicaoAutenticada('/api/edicoes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montarPayloadEdicao(dados)),
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroCadastroEdicaoPrograma(
      mensagem || 'Não foi possível cadastrar a edição do programa.',
    )
  }

  const resposta = await response.json()
  const edicao = interpretarRespostaEdicaoPrograma(resposta)

  if (!edicao) {
    throw new ErroCadastroEdicaoPrograma('Resposta de cadastro inválida.')
  }

  return edicao
}

export async function atualizarEdicaoPrograma(
  id: string,
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  const response = await requisicaoAutenticada(`/api/edicoes/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montarPayloadEdicao(dados)),
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroAtualizacaoEdicaoPrograma(
      mensagem || 'Não foi possível atualizar a edição do programa.',
    )
  }

  const resposta = await response.json()
  const edicao = interpretarRespostaEdicaoPrograma(resposta)

  if (!edicao) {
    throw new ErroAtualizacaoEdicaoPrograma('Resposta de atualização inválida.')
  }

  return edicao
}

export async function listarEdicoesPrograma({
  pagina = 1,
  tamanhoPagina = 10,
}: ParametrosListagemEdicoesPrograma = {}): Promise<ListagemEdicoesPrograma> {
  const parametros = new URLSearchParams({
    page: String(pagina),
    pageSize: String(tamanhoPagina),
  })

  const response = await requisicaoAutenticada(
    `/api/edicoes/?${parametros.toString()}`,
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroListagemEdicoesPrograma(
      mensagem || 'Não foi possível carregar as edições do programa.',
    )
  }

  const dados = await response.json()
  const listagem = interpretarRespostaListagemEdicoesPaginada(dados)

  if (!listagem) {
    throw new ErroListagemEdicoesPrograma('Resposta de listagem inválida.')
  }

  return listagem
}
