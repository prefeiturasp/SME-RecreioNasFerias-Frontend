import { api } from '../api/http'
import type { DadosPontoFocalPolo, PoloDetalhado } from './types'

export async function atualizarPontoFocalPolo(
  uuid: string,
  dados: DadosPontoFocalPolo,
): Promise<PoloDetalhado> {
  const { data } = await api.patch<PoloDetalhado>(
    `/api/v1/polos/${uuid}/`,
    {
      ponto_focal_nome: dados.ponto_focal_nome.trim(),
      ponto_focal_telefone: dados.ponto_focal_telefone.trim(),
      ponto_focal_email: dados.ponto_focal_email.trim(),
    },
  )

  return data
}
