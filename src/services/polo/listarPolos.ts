import { api } from '../api/http'
import type { ListagemPolosPaginada } from './types'

export async function listarPolos(
  busca?: string,
  dre_codigo_eol?: string,
  tipo_ue?: string,
  page = 1,
  page_size = 10,
): Promise<ListagemPolosPaginada> {
  const { data } = await api.get<ListagemPolosPaginada>('/api/v1/polos/', {
    params: { busca, dre_codigo_eol, tipo_ue, page, page_size },
  })
  return data
}
