import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { EdicaoPrograma } from './types'

function rotaObterEdicao(uuid: string) {
  return `/api/v1/edicoes/${uuid}/`
}

export async function obterEdicaoPrograma(
  uuid: string,
): Promise<EdicaoPrograma> {
  const { data } = await api.get(rotaObterEdicao(uuid))

  const edicao = interpretarItemEdicaoPrograma(data as unknown)

  if (!edicao) {
    throw new Error()
  }

  return edicao
}
