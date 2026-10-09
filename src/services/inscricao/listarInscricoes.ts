import { api } from '../api/http'
import type { FiltrosIncricoesParticipantes, Inscricao } from './types'

export async function listarInscricoes(
  params?: Partial<FiltrosIncricoesParticipantes> & {
    page?: number
    page_size?: number
  },
): Promise<Inscricao[]> {
  const { data } = await api.get<Inscricao[]>('/api/v1/inscricoes/', {
    params,
  })

  return data
}
