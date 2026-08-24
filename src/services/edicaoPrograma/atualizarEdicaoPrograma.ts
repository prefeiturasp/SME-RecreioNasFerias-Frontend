import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

export class ErroAtualizacaoEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('ATUALIZACAO_EDICAO_FAILED')
    this.name = 'ErroAtualizacaoEdicaoPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

type PayloadAtualizacaoEdicaoPrograma = {
  nome: string
  data_inicio: string
  data_fim: string
  inscricoes_inicio: string
  inscricoes_fim: string
}

function montarPayloadEdicao(
  dados: DadosCadastroEdicaoPrograma,
): PayloadAtualizacaoEdicaoPrograma {
  return {
    nome: dados.nome,
    data_inicio: dados.dataInicioEdicao,
    data_fim: dados.dataFimEdicao,
    inscricoes_inicio: dados.dataInicioInscricoes,
    inscricoes_fim: dados.dataFimInscricoes,
  }
}

function rotaAtualizarEdicao(uuid: string) {
  return `/api/v1/edicoes/${uuid}/`
}

export async function atualizarEdicaoPrograma(
  uuid: string,
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.put(
      rotaAtualizarEdicao(uuid),
      montarPayloadEdicao(dados),
    )

    const edicao = interpretarItemEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroAtualizacaoEdicaoPrograma('')
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroAtualizacaoEdicaoPrograma) {
      throw error
    }

    throw new ErroAtualizacaoEdicaoPrograma(extrairMensagemDeErro(error))
  }
}
