import { api } from '../api/http'
import type { TipoEscolaPolo } from './types'

export async function listarTiposEscolaPolo(): Promise<TipoEscolaPolo[]> {
  const { data } = await api.get<TipoEscolaPolo[]>('/api/v1/polos/tipos-escola/')
  return data
}
