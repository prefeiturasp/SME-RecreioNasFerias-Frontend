import { api } from '../api/http'
import type { DefinicaoPoloApi } from './types'

export async function listarDefinicoesPolo(
  busca?: string,
  dre_codigos_eol?: string,
  tipo_ue?: string,
  edicao?: string,
  gestao?: string,
  tipo_polo?: string,
): Promise<DefinicaoPoloApi[]> {
  const { data } = await api.get<DefinicaoPoloApi[]>(
    '/api/v1/definicoes-polos/',
    {
      params: {
        busca,
        dre_codigos_eol,
        tipo_ue,
        edicao,
        gestao,
        tipo_polo,
      },
    },
  )

  return data
}
