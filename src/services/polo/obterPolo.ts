import { api } from '../api/http'
import type { PoloDetalhado } from './types'

export async function obterPolo(uuid: string): Promise<PoloDetalhado> {
  const { data } = await api.get<PoloDetalhado>(`/api/v1/polos/${uuid}/`)
  return data
}
