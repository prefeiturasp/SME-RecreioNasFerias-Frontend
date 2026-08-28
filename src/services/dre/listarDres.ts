import { api } from '@/services/api/http'
import type { Dre } from './types'

export async function listarDres(): Promise<Dre[]> {
  const { data } = await api.get('/api/v1/polos/dres/')
  return data
}
