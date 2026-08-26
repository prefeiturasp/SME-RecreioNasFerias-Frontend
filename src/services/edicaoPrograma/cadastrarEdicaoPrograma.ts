import { api } from '../api/http'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

export async function cadastrarEdicaoPrograma(
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  const { data } = await api.post<EdicaoPrograma>('/api/v1/edicoes/', {
    nome: dados.nome,
    data_inicio: dados.dataInicioEdicao,
    data_fim: dados.dataFimEdicao,
    inscricoes_inicio: dados.dataInicioInscricoes,
    inscricoes_fim: dados.dataFimInscricoes,
  })

  return data
}
