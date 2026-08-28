import { useQuery } from '@tanstack/react-query'
import { listarDres } from '@/services/dre/listarDres'
import type { Dre } from '@/services/dre/types'

export function useGetDres() {
  return useQuery<Dre[], Error>({
    queryKey: ['dres'],
    queryFn: listarDres,
  })
}

export default useGetDres
