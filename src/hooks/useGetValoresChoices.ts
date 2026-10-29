import { useQuery } from '@tanstack/react-query'
import { listarValoresChoices } from '@/services/inscricao/listarValoresChoices'
import type { ValoresChoicesInscricao } from '@/services/inscricao/types'

export function useGetValoresChoices() {
  return useQuery<ValoresChoicesInscricao, Error>({
    queryKey: ['valoresChoicesInscricao'],
    queryFn: listarValoresChoices,
    staleTime: 30 * 60 * 1000, // 30 minutos
  })
}

export default useGetValoresChoices
