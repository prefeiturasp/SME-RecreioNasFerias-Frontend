import { api } from '@/services/api/http'
import type { TipoEscola } from './types'

export async function listarTiposEscola(): Promise<TipoEscola[]> {
  const { data } = await api.get('/api/v1/polos/tipos-escola/')
  return data
}
