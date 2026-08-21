import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarRespostaEdicaoPrograma } from './interpretarRespostaListagemEdicoes'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from './mocks'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

export class ErroCadastroEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('CADASTRO_EDICAO_FAILED')
    this.name = 'ErroCadastroEdicaoPrograma'
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

export async function cadastrarEdicaoPrograma(
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.post('/api/edicoes/', montarPayloadEdicao(dados))

    const edicao = interpretarRespostaEdicaoPrograma(data as unknown)

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
