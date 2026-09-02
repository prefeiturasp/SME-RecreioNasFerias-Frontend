import { api } from '../api/http'
import type {
  DefinicaoPoloApi,
  RespostaListagemDefinicoesPoloApi,
} from './types'

export async function listarDefinicoesPolo(): Promise<DefinicaoPoloApi[]> {
  const { data } = await api.get<RespostaListagemDefinicoesPoloApi>(
    '/api/polos/',
  )

  return data.results
}
