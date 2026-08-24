import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { EdicaoPrograma } from './types'

const ROTA_LISTAGEM_EDICOES = '/api/v1/edicoes/'

export class ErroListagemEdicoesPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_EDICOES_FAILED')
    this.name = 'ErroListagemEdicoesPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

export async function listarEdicoesPrograma(): Promise<EdicaoPrograma[]> {
  try {
    const { data } = await api.get(ROTA_LISTAGEM_EDICOES)

    if (!Array.isArray(data)) {
      throw new ErroListagemEdicoesPrograma('')
    }

    const edicoes: EdicaoPrograma[] = []

    for (const item of data) {
      const edicao = interpretarItemEdicaoPrograma(item)

      if (!edicao) {
        throw new ErroListagemEdicoesPrograma('')
      }

      edicoes.push(edicao)
    }

    return edicoes
  } catch (error) {
    if (error instanceof ErroListagemEdicoesPrograma) {
      throw error
    }

    throw new ErroListagemEdicoesPrograma(extrairMensagemDeErro(error))
  }
}
