import { api } from '../api/http'
import type { PoloDetalhado } from './types'

export async function obterPolo(id: string): Promise<PoloDetalhado> {
  const { data } = await api.get<PoloDetalhado>(`/api/polos/${id}/`)
  return data
}
