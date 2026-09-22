import { api } from '../api/http'
import type {
  ListagemHistoricoDefinicaoPolo,
  ParametrosHistoricoDefinicaoPolo,
} from './types'

export async function listarHistoricoDefinicaoPolo(
  parametros: ParametrosHistoricoDefinicaoPolo,
): Promise<ListagemHistoricoDefinicaoPolo> {
  const {
    polo = '',
    page = 1,
    page_size = 10,
    desabilita_paginacao = false,
  } = parametros

  const params: Record<string, string | number | boolean> = {}

  if (desabilita_paginacao) {
    params.desabilita_paginacao = true
  } else {
    params.page = page
    params.page_size = page_size
  }

  if (polo.trim()) {
    params.polo = polo.trim()
  }

  const { data } = await api.get<ListagemHistoricoDefinicaoPolo>(
    '/api/v1/definicoes-polos/historico/',
    { params },
  )

  return data
}
