import { useQuery } from '@tanstack/react-query'
import { obterPolo } from '@/services/polo/obterPolo'

export function useGetPolo(id: string | undefined) {
  return useQuery({
    queryKey: ['polo', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Id do polo não informado.')
      }

      return obterPolo(id)
    },
    enabled: Boolean(id),
  })
}

export default useGetPolo
