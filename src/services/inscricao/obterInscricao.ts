import { api } from '../api/http'
import type { InscricaoDetalhe } from './types'

export async function obterInscricao(uuid: string): Promise<InscricaoDetalhe> {
  const { data } = await api.get<InscricaoDetalhe>(
    `/api/v1/inscricoes/${uuid}/`,
  )
  return data
}
