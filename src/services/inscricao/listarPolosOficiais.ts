import { api } from '../api/http'
import type { PoloOficial } from './types'

export async function listarPolosOficiais(): Promise<PoloOficial[]> {
  const { data } = await api.get<PoloOficial[]>(
    '/api/v1/inscricoes/polos-oficiais/',
    {
      params: {
        desabilita_paginacao: true,
      },
    },
  )

  return data
}
