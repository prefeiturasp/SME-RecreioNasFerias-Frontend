import { useQuery } from '@tanstack/react-query'
import { obterPolo } from '@/services/polo/obterPolo'

export function useGetPolo(uuid: string | undefined) {
  return useQuery({
    queryKey: ['polo', uuid],
    queryFn: () => {
      if (!uuid) {
        throw new Error('UUID do polo não informado.')
      }

      return obterPolo(uuid)
    },
    enabled: Boolean(uuid),
  })
}

export default useGetPolo
