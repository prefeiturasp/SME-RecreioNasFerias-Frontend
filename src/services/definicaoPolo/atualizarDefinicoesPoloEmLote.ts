import { api } from '../api/http'
import type {
  ParametrosAtualizacaoDefinicoesPoloEmLote,
  ResultadoAtualizacaoDefinicoesPoloEmLote,
} from './types'

export async function atualizarDefinicoesPoloEmLote(
  dados: ParametrosAtualizacaoDefinicoesPoloEmLote,
): Promise<ResultadoAtualizacaoDefinicoesPoloEmLote> {
  const { data } = await api.patch<ResultadoAtualizacaoDefinicoesPoloEmLote>(
    '/api/polos/atualizacao-lote/',
    dados,
  )

  return data
}
