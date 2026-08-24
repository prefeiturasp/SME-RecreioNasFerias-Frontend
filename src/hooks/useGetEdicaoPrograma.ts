import { useQuery } from '@tanstack/react-query'
import { obterEdicaoPrograma } from '@/services/edicaoPrograma/obterEdicaoPrograma'

export function useGetEdicaoPrograma(uuid: string | undefined) {
  return useQuery({
    queryKey: ['edicaoPrograma', uuid],
    queryFn: () => obterEdicaoPrograma(uuid as string),
    enabled: Boolean(uuid),
  })
}

export default useGetEdicaoPrograma
