import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarRespostaEdicaoPrograma } from './interpretarRespostaListagemEdicoes'
import type {
  DadosCadastroEdicaoPrograma,
  EdicaoPrograma,
  QuantidadesEdicaoPrograma,
} from './types'

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
  quantidades: QuantidadesEdicaoPrograma,
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
