import { api } from '../api/http'
import type {
  ListagemDefinicoesPoloPaginada,
  ParametrosListagemDefinicoesPolo,
} from './types'

export async function listarDefinicoesPolo(
  parametros: ParametrosListagemDefinicoesPolo = {},
): Promise<ListagemDefinicoesPoloPaginada> {
  const {
    busca,
    dre_codigos_eol,
    tipo_ue,
    edicao,
    gestao,
    tipo_polo,
    page = 1,
    page_size = 10,
  } = parametros

  const { data } = await api.get<ListagemDefinicoesPoloPaginada>(
    '/api/v1/definicoes-polos/',
    {
      params: {
        busca,
        dre_codigos_eol,
        tipo_ue,
        edicao,
        gestao,
        tipo_polo,
        page,
        page_size,
      },
    },
  )

  return data
}
