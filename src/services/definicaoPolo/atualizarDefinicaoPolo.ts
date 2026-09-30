import { api } from '../api/http'
import type {
  DadosAtualizacaoDefinicaoPolo,
  DefinicaoPoloDetalhe,
} from './types'

export async function atualizarDefinicaoPolo(
  uuid: string,
  dados: DadosAtualizacaoDefinicaoPolo,
): Promise<DefinicaoPoloDetalhe> {
  const { data } = await api.put<DefinicaoPoloDetalhe>(
    `/api/v1/definicoes-polos/${uuid}/`,
    {
      polo: dados.polo,
      edicao: dados.edicao,
      tipo: dados.tipo,
      projecao_inscritos: dados.projecao_inscritos,
      ponto_focal_nome: dados.ponto_focal_nome,
      ponto_focal_telefone: dados.ponto_focal_telefone,
      ponto_focal_email: dados.ponto_focal_email,
    },
  )

  return data
}
