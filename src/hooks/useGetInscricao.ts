import { useQuery } from '@tanstack/react-query'
import { obterInscricao } from '@/services/inscricao/obterInscricao'

export function useGetInscricao(uuid: string | undefined) {
  return useQuery({
    queryKey: ['inscricao', uuid],
    queryFn: () => {
      if (!uuid) {
        throw new Error('UUID da inscrição não informado.')
      }

      return obterInscricao(uuid)
    },
    enabled: Boolean(uuid),
  })
}

export default useGetInscricao
