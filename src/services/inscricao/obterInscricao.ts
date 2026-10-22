import { api } from '../api/http'
import type { InscricaoDetalheApi } from './types'

export async function obterInscricao(
  uuid: string,
): Promise<InscricaoDetalheApi> {
  const { data } = await api.get<InscricaoDetalheApi>(
    `/api/v1/inscricoes/${uuid}/`,
  )

  return data
}
