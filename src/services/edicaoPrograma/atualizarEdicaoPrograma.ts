import { api } from '../api/http'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

export async function atualizarEdicaoPrograma(
  uuid: string,
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  const { data } = await api.put<EdicaoPrograma>(`/api/v1/edicoes/${uuid}/`, {
    nome: dados.nome,
    data_inicio: dados.dataInicioEdicao,
    data_fim: dados.dataFimEdicao,
    inscricoes_inicio: dados.dataInicioInscricoes,
    inscricoes_fim: dados.dataFimInscricoes,
  })

  return data
}
