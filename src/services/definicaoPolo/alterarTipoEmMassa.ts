import { api } from '../api/http'
import type {
  ItemAlterarTipoEmMassa,
  ResultadoAlterarTipoEmMassa,
} from './types'

export async function alterarTipoEmMassa(
  dados: ItemAlterarTipoEmMassa[],
): Promise<ResultadoAlterarTipoEmMassa> {
  const { data } = await api.post<ResultadoAlterarTipoEmMassa>(
    '/api/v1/definicoes-polos/alterar-tipo-em-massa/',
    dados,
  )

  return data
}
