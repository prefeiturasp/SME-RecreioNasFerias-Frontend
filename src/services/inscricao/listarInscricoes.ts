import { api } from '../api/http'
import type {
  FiltrosIncricoesParticipantes,
  InscricaoApi,
  InscricoesParticipantesPaginada,
} from './types'

export async function listarInscricoes(
  params?: Partial<FiltrosIncricoesParticipantes> & {
    page?: number
    page_size?: number
  },
): Promise<InscricoesParticipantesPaginada | InscricaoApi[]> {
  const { data } = await api.get<
    InscricoesParticipantesPaginada | InscricaoApi[]
  >(
    '/api/v1/inscricoes/',
    {
      params,
    },
  )

  return data
}
