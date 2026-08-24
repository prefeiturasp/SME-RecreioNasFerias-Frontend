import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

const ROTA_CADASTRO_EDICAO = '/api/v1/edicoes/'

export class ErroCadastroEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('CADASTRO_EDICAO_FAILED')
    this.name = 'ErroCadastroEdicaoPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

type PayloadCadastroEdicaoPrograma = {
  nome: string
  data_inicio: string
  data_fim: string
  inscricoes_inicio: string
  inscricoes_fim: string
}

function montarPayloadEdicao(
  dados: DadosCadastroEdicaoPrograma,
): PayloadCadastroEdicaoPrograma {
  return {
    nome: dados.nome,
    data_inicio: dados.dataInicioEdicao,
    data_fim: dados.dataFimEdicao,
    inscricoes_inicio: dados.dataInicioInscricoes,
    inscricoes_fim: dados.dataFimInscricoes,
  }
}

export async function cadastrarEdicaoPrograma(
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.post(
      ROTA_CADASTRO_EDICAO,
      montarPayloadEdicao(dados),
    )

    const edicao = interpretarItemEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroCadastroEdicaoPrograma('')
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroCadastroEdicaoPrograma) {
      throw error
    }

    throw new ErroCadastroEdicaoPrograma(extrairMensagemDeErro(error))
  }
}
