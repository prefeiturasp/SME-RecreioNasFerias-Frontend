import { api } from '../api/http'
import type { PoloElegivel } from './types'

export async function listarPolosOficiais(): Promise<PoloElegivel[]> {
  const { data } = await api.get<PoloElegivel[]>(
    '/api/v1/inscricoes/polos-oficiais/',
    {
      params: {
        desabilita_paginacao: true,
      },
    },
  )

  return data
}
