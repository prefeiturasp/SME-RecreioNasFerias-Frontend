import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { EdicaoPrograma } from './types'

export class ErroObterEdicaoPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('OBTER_EDICAO_FAILED')
    this.name = 'ErroObterEdicaoPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

export async function obterEdicaoPrograma(
  uuid: string,
): Promise<EdicaoPrograma> {
  try {
    const { data } = await api.get(`/api/v1/edicoes/${uuid}/`)

    const edicao = interpretarItemEdicaoPrograma(data as unknown)

    if (!edicao) {
      throw new ErroObterEdicaoPrograma('')
    }

    return edicao
  } catch (error) {
    if (error instanceof ErroObterEdicaoPrograma) {
      throw error
    }

    throw new ErroObterEdicaoPrograma(extrairMensagemDeErro(error))
  }
}
