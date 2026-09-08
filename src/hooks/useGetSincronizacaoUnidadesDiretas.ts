import { useQuery } from '@tanstack/react-query'
import { popularPolos } from '@/services/definicaoPolo/popularPolos'
import type { ResultadoPopularPolos } from '@/services/definicaoPolo/types'

export function useGetSincronizacaoUnidadesDiretas(enabled = false) {
  return useQuery<ResultadoPopularPolos, Error>({
    queryKey: ['popularPolos'],
    queryFn: () => popularPolos(),
    enabled,
    staleTime: Infinity,
    retry: false,
  })
}

export default useGetSincronizacaoUnidadesDiretas
