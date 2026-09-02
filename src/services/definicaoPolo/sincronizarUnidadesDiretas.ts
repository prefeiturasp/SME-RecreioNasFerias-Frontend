import { api } from '../api/http'
import type { ResultadoSincronizacaoUnidadesDiretas } from './types'

export async function sincronizarUnidadesDiretas(): Promise<ResultadoSincronizacaoUnidadesDiretas> {
  const { data } = await api.get<ResultadoSincronizacaoUnidadesDiretas>(
    '/api/polos/unidades-diretas/',
  )

  return data
}
