import { useQuery } from '@tanstack/react-query'
import { obterEdicaoPrograma } from '@/services/edicaoPrograma/obterEdicaoPrograma'

export function useGetEdicaoPrograma(uuid: string | undefined) {
  return useQuery({
    queryKey: ['edicaoPrograma', uuid],
    queryFn: () => {
      if (!uuid) {
        throw new Error('UUID da edição não informado.')
      }

      return obterEdicaoPrograma(uuid)
    },
    enabled: Boolean(uuid),
  })
}

export default useGetEdicaoPrograma
