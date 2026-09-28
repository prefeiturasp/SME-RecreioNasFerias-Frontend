import { api } from '../api/http'
import type { DadosCadastroInscricao, Inscricao } from './types'

export async function cadastrarInscricao(
  dados: DadosCadastroInscricao,
): Promise<Inscricao> {
  const { data } = await api.post<Inscricao>('/api/v1/inscricoes/', dados)

  return data
}
