import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
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
  QuantidadesEdicaoPrograma,
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

export class ErroObterEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('OBTER_EDICAO_FAILED')
    this.name = 'ErroObterEdicaoPrograma'
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

function montarPayloadEdicao(
  dados: DadosCadastroEdicaoPrograma,
  quantidades: QuantidadesEdicaoPrograma = QUANTIDADES_MOCK_CADASTRO_EDICAO,
) {
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
    ...quantidades,
  }
}

export async function cadastrarEdicaoPrograma(
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.post('/api/edicoes/', montarPayloadEdicao(dados))

    const edicao = interpretarRespostaEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroCadastroEdicaoPrograma('Resposta de cadastro inválida.')
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroCadastroEdicaoPrograma) {
      throw error
    }

    throw new ErroCadastroEdicaoPrograma(
      extrairMensagemDeErro(error) ||
        'Não foi possível cadastrar a edição do programa.',
    )
  }
}

export async function obterEdicaoPrograma(id: string): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.get(`/api/edicoes/${id}/`)

    const edicao = interpretarRespostaEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroObterEdicaoPrograma('Resposta de consulta inválida.')
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroObterEdicaoPrograma) {
      throw error
    }

    throw new ErroObterEdicaoPrograma(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar a edição do programa.',
    )
  }
}

export async function atualizarEdicaoPrograma(
  id: string,
  dados: DadosCadastroEdicaoPrograma,
  quantidades: QuantidadesEdicaoPrograma,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.put(
      `/api/edicoes/${id}/`,
      montarPayloadEdicao(dados, quantidades),
    )

    const edicao = interpretarRespostaEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroAtualizacaoEdicaoPrograma(
        'Resposta de atualização inválida.',
      )
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroAtualizacaoEdicaoPrograma) {
      throw error
    }

    throw new ErroAtualizacaoEdicaoPrograma(
      extrairMensagemDeErro(error) ||
        'Não foi possível atualizar a edição do programa.',
    )
  }
}

export async function listarEdicoesPrograma({
  pagina = 1,
  tamanhoPagina = 10,
}: ParametrosListagemEdicoesPrograma = {}): Promise<ListagemEdicoesPrograma> {
  try {
    const { data } = await api.get('/api/edicoes/', {
      params: {
        page: String(pagina),
        pageSize: String(tamanhoPagina),
      },
    })

    const listagem = interpretarRespostaListagemEdicoesPaginada(data as unknown)

    if (!listagem) {
      throw new ErroListagemEdicoesPrograma('Resposta de listagem inválida.')
    }

    return listagem
  } catch (error) {
    if (error instanceof ErroListagemEdicoesPrograma) {
      throw error
    }

    throw new ErroListagemEdicoesPrograma(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar as edições do programa.',
    )
  }
}
