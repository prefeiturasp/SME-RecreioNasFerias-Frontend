import { api } from '../api/http'
import type { ResultadoPopularPolos } from './types'

export async function popularPolos(): Promise<ResultadoPopularPolos> {
  const { data } = await api.post<ResultadoPopularPolos>(
    '/api/v1/polos/popular/',
  )

  return data
}
