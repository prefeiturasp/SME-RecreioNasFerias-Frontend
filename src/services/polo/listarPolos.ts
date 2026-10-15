import { api } from '../api/http'
import type { ListagemPolosPaginada } from './types'

export async function listarPolos(
  params: Record<string, string | number>,
): Promise<ListagemPolosPaginada> {
  const { data } = await api.get<ListagemPolosPaginada>('/api/v1/polos/', {
    params,
  })
  return data
}
