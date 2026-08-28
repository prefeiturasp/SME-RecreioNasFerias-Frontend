import { useQuery } from '@tanstack/react-query'
import { listarDresPolo } from '@/services/polo/listarDresPolo'

export function useGetDresPolo() {
  return useQuery({
    queryKey: ['dresPolo'],
    queryFn: () => listarDresPolo(),
  })
}

export default useGetDresPolo
