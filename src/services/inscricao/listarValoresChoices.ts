import { api } from '../api/http'
import type { ValoresChoicesInscricao } from './types'

export async function listarValoresChoices(): Promise<ValoresChoicesInscricao> {
  const { data } = await api.get<ValoresChoicesInscricao>(
    '/api/v1/inscricoes/valores-choices/',
  )
  return data
}
