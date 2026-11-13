import { api } from '../api/http'
import type { ParticipanteEol } from './types'

export async function obterParticipanteEol(
  codigoEol: string,
  inscricaoId?: string,
): Promise<ParticipanteEol> {
  const { data } = await api.get<ParticipanteEol>(
    '/api/v1/inscricoes/participante-eol/',
    {
      params: {
        codigo_eol: codigoEol,
        ...(inscricaoId ? { inscricao: inscricaoId } : {}),
      },
    },
  )
  return data
}
