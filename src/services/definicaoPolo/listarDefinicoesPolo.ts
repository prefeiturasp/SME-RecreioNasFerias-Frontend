import { api } from '../api/http'
import type {
  ListagemDefinicoesPoloPaginada,
  ParametrosListagemDefinicoesPolo,
} from './types'

export async function listarDefinicoesPolo(
  parametros: ParametrosListagemDefinicoesPolo = {},
): Promise<ListagemDefinicoesPoloPaginada> {
  const {
    busca = '',
    dre_codigos_eol = [],
    tipo_ue = '',
    edicao = '',
    gestao = '',
    tipo_polo = '',
    page = 1,
    page_size = 10,
  } = parametros

  const params: Record<string, string | number | string[]> = {
    page,
    page_size,
  }

  if (busca.trim()) {
    params.busca = busca.trim()
  }

  if (dre_codigos_eol.length > 0) {
    params.dre_codigos_eol = dre_codigos_eol
  }

  if (tipo_ue.trim()) {
    params.tipo_ue = tipo_ue.trim()
  }

  if (edicao.trim()) {
    params.edicao = edicao.trim()
  }

  if (gestao.trim()) {
    params.gestao = gestao.trim()
  }

  if (tipo_polo.trim()) {
    params.tipo_polo = tipo_polo.trim()
  }

  const { data } = await api.get<ListagemDefinicoesPoloPaginada>(
    '/api/v1/definicoes-polos/',
    {
      params,
      // DRF espera `dre_codigos_eol=a&dre_codigos_eol=b` (sem colchetes).
      paramsSerializer: { indexes: null },
    },
  )

  return data
}
