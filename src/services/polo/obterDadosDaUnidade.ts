import { api } from '../api/http'
import type { DadosDaUnidade } from './types'

export async function obterDadosDaUnidade(
  codigoEol: string,
): Promise<DadosDaUnidade> {
  const { data } = await api.get<DadosDaUnidade>(
    '/api/v1/polos/dados-da-unidade/',
    { params: { codigo_eol: codigoEol } },
  )
  return data
}
