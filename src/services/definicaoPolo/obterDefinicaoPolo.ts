import { api } from '../api/http'
import type { DefinicaoPoloDetalhe } from './types'

export async function obterDefinicaoPolo(
  uuid: string,
): Promise<DefinicaoPoloDetalhe> {
  const { data } = await api.get<DefinicaoPoloDetalhe>(
    `/api/v1/definicoes-polos/${uuid}/`,
  )

  return data
}
