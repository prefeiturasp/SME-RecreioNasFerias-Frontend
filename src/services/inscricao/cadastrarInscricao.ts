import { api } from '../api/http'
import { corpoInscricao } from './corpoInscricao'
import type { DadosCadastroInscricao, Inscricao } from './types'

export async function cadastrarInscricao(
  dados: DadosCadastroInscricao,
): Promise<Inscricao> {
  const { data } = await api.post<Inscricao>(
    '/api/v1/inscricoes/',
    corpoInscricao(dados),
  )

  return data
}
