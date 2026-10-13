import { api } from '../api/http'
import type { ParticipanteEol } from './types'

export async function obterParticipanteCpf(
  cpf: string,
): Promise<ParticipanteEol> {
  const { data } = await api.get<ParticipanteEol>(
    '/api/v1/inscricoes/participante-cpf/',
    { params: { cpf } },
  )
  return data
}
