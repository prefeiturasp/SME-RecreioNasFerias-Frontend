import { useQuery } from '@tanstack/react-query'
import { listarValoresChoices } from '@/services/inscricao/listarValoresChoices'
import type { ValoresChoicesInscricao } from '@/services/inscricao/types'

export function useGetValoresChoices() {
  return useQuery<ValoresChoicesInscricao, Error>({
    queryKey: ['valoresChoicesInscricao'],
    queryFn: listarValoresChoices,
  })
}

export default useGetValoresChoices
