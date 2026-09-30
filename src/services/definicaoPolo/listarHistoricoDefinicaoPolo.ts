import { api } from '../api/http'
import type {
  ListagemHistoricoDefinicaoPoloPaginada,
  ParametrosHistoricoDefinicaoPolo,
} from './types'

export async function listarHistoricoDefinicaoPolo(
  parametros: ParametrosHistoricoDefinicaoPolo,
): Promise<ListagemHistoricoDefinicaoPoloPaginada> {
  const { polo = '', page = 1, page_size = 10 } = parametros

  const params: Record<string, string | number> = {
    page,
    page_size,
  }

  if (polo.trim()) {
    params.polo = polo.trim()
  }

  const { data } = await api.get<ListagemHistoricoDefinicaoPoloPaginada>(
    '/api/v1/definicoes-polos/historico/',
    { params },
  )

  return data
}
