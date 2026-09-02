import { useQuery } from '@tanstack/react-query'
import { listarDefinicoesPolo } from '@/services/definicaoPolo/listarDefinicoesPolo'
import type { DefinicaoPoloApi } from '@/services/definicaoPolo/types'

export function useGetDefinicoesPolo() {
  return useQuery<DefinicaoPoloApi[], Error>({
    queryKey: ['definicoesPolo'],
    queryFn: () => listarDefinicoesPolo(),
  })
}

export default useGetDefinicoesPolo
