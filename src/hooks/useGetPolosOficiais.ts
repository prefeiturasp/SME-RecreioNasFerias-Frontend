import { useQuery } from '@tanstack/react-query'
import { listarPolosOficiais } from '@/services/inscricao/listarPolosOficiais'

export function useGetPolosOficiais() {
  return useQuery({
    queryKey: ['polosOficiais'],
    queryFn: () => listarPolosOficiais(),
  })
}

export default useGetPolosOficiais
