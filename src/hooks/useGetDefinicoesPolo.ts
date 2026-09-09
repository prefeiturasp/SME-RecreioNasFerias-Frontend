import { useQuery } from '@tanstack/react-query'
import { listarDefinicoesPolo } from '@/services/definicaoPolo/listarDefinicoesPolo'
import type { DefinicaoPoloApi } from '@/services/definicaoPolo/types'

export function useGetDefinicoesPolo(
  busca?: string,
  dre_codigos_eol?: string,
  tipo_ue?: string,
  edicao?: string,
  gestao?: string,
  tipo_polo?: string,
  opcoes?: { refetchInterval?: number | false },
) {
  return useQuery<DefinicaoPoloApi[], Error>({
    queryKey: [
      'definicoesPolo',
      busca,
      dre_codigos_eol,
      tipo_ue,
      edicao,
      gestao,
      tipo_polo,
    ],
    queryFn: () =>
      listarDefinicoesPolo(
        busca,
        dre_codigos_eol,
        tipo_ue,
        edicao,
        gestao,
        tipo_polo,
      ),
    refetchInterval: opcoes?.refetchInterval,
  })
}

export default useGetDefinicoesPolo
