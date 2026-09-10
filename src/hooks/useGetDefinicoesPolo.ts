import { useQuery } from '@tanstack/react-query'
import { listarDefinicoesPolo } from '@/services/definicaoPolo/listarDefinicoesPolo'
import type {
  ListagemDefinicoesPoloPaginada,
  ParametrosListagemDefinicoesPolo,
} from '@/services/definicaoPolo/types'

type OpcoesUseGetDefinicoesPolo = {
  refetchInterval?: number | false
}

export function useGetDefinicoesPolo(
  parametros: ParametrosListagemDefinicoesPolo = {},
  opcoes?: OpcoesUseGetDefinicoesPolo,
) {
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

  return useQuery<ListagemDefinicoesPoloPaginada, Error>({
    queryKey: [
      'definicoesPolo',
      busca,
      dre_codigos_eol,
      tipo_ue,
      edicao,
      gestao,
      tipo_polo,
      page,
      page_size,
    ],
    queryFn: () =>
      listarDefinicoesPolo({
        busca,
        dre_codigos_eol,
        tipo_ue,
        edicao,
        gestao,
        tipo_polo,
        page,
        page_size,
      }),
    refetchInterval: opcoes?.refetchInterval,
  })
}

export default useGetDefinicoesPolo
