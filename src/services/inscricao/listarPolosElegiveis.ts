import { api } from '../api/http'
import type { PoloElegivel } from './types'

export async function listarPolosElegiveis(
  dreCodigoEol: string,
): Promise<PoloElegivel[]> {
  const { data } = await api.get<PoloElegivel[]>(
    '/api/v1/inscricoes/polos-elegiveis/',
    {
      params: {
        dre_codigo_eol: dreCodigoEol,
        desabilita_paginacao: true,
      },
    },
  )

  return data
}
