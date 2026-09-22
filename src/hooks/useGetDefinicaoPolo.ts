import { useQuery } from '@tanstack/react-query'
import { obterDefinicaoPolo } from '@/services/definicaoPolo/obterDefinicaoPolo'

export function useGetDefinicaoPolo(uuid: string | undefined) {
  return useQuery({
    queryKey: ['definicaoPolo', uuid],
    queryFn: () => {
      if (!uuid) {
        throw new Error('UUID da definição do polo não informado.')
      }

      return obterDefinicaoPolo(uuid)
    },
    enabled: Boolean(uuid),
  })
}

export default useGetDefinicaoPolo
