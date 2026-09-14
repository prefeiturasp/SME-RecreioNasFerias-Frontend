import { api } from '../api/http'
import type { DadosVincularEmMassa, DefinicaoPolo } from './types'

export async function vincularEmMassa(
  dados: DadosVincularEmMassa,
): Promise<DefinicaoPolo[]> {
  const { data } = await api.post<DefinicaoPolo[]>(
    '/api/v1/definicoes-polos/vincular-em-massa/',
    {
      polos: dados.polos,
      edicao: dados.edicao,
      projecao_inscritos: 0,
    },
  )

  return data
}
