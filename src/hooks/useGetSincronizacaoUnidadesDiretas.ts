import { useQuery } from '@tanstack/react-query'
import { sincronizarUnidadesDiretas } from '@/services/definicaoPolo/sincronizarUnidadesDiretas'
import type { ResultadoSincronizacaoUnidadesDiretas } from '@/services/definicaoPolo/types'

export function useGetSincronizacaoUnidadesDiretas(enabled = false) {
  return useQuery<ResultadoSincronizacaoUnidadesDiretas, Error>({
    queryKey: ['sincronizacaoUnidadesDiretas'],
    queryFn: () => sincronizarUnidadesDiretas(),
    enabled,
    staleTime: Infinity,
    retry: false,
  })
}

export default useGetSincronizacaoUnidadesDiretas
