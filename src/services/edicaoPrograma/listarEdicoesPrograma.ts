import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { EdicaoPrograma } from './types'

const ROTA_LISTAGEM_EDICOES = '/api/v1/edicoes/'

export async function listarEdicoesPrograma(): Promise<EdicaoPrograma[]> {
  const { data } = await api.get(ROTA_LISTAGEM_EDICOES)

  if (!Array.isArray(data)) {
    throw new Error()
  }

  const edicoes: EdicaoPrograma[] = []

  for (const item of data) {
    const edicao = interpretarItemEdicaoPrograma(item)

    if (!edicao) {
      throw new Error()
    }

    edicoes.push(edicao)
  }

  return edicoes
}
