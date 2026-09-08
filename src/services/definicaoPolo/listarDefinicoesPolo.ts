import { api } from '../api/http'
import type { DefinicaoPoloApi } from './types'

export async function listarDefinicoesPolo(): Promise<DefinicaoPoloApi[]> {
  const { data } = await api.get<DefinicaoPoloApi[]>(
    '/api/v1/definicoes-polos/',
  )

  return data
}
