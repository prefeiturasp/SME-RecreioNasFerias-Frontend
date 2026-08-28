import { api } from '../api/http'
import type { PoloDetalhado } from './types'

export async function listarPolos(
  busca?: string,
  dre_codigo_eol?: string,
  tipo_ue?: string,
): Promise<PoloDetalhado[]> {
  const { data } = await api.get('/api/v1/polos/', {
    params: { busca, dre_codigo_eol, tipo_ue },
  })
  return data
}
