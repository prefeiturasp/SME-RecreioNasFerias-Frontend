import { api } from '../api/http'
import { corpoInscricao } from './corpoInscricao'
import type { DadosCadastroInscricao, Inscricao } from './types'

export async function atualizarInscricao(
  uuid: string,
  dados: DadosCadastroInscricao,
): Promise<Inscricao> {
  const { data } = await api.put<Inscricao>(
    `/api/v1/inscricoes/${uuid}/`,
    corpoInscricao(dados),
  )

  return data
}
