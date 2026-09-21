import { api } from '../api/http'
import type { DetalheDefinicaoPolo } from './types'

export async function listarDetalheDefinicaoPolo(
  definicaoPoloUuid: string,
): Promise<DetalheDefinicaoPolo> {
  const { data } = await api.get<DetalheDefinicaoPolo>(
    `/api/v1/definicoes-polos/${definicaoPoloUuid}/`,
  )

  return data
}
