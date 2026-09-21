import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarDetalheDefinicaoPolo } from '@/services/definicaoPolo/listarDetalheDefinicaoPolo'

export function useGetDefinicaoPolo(definicaoPoloUuid: string | undefined) {
  return useQuery({
    queryKey: ['definicaoPolo', definicaoPoloUuid],
    queryFn: () => {
      if (!definicaoPoloUuid) {
        throw new Error('UUID da definição do polo não informado.')
      }

      return listarDetalheDefinicaoPolo(definicaoPoloUuid)
    },
    enabled: Boolean(definicaoPoloUuid),
    placeholderData: keepPreviousData,
  })
}

export default useGetDefinicaoPolo
