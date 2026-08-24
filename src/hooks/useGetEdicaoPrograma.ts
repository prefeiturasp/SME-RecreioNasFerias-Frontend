import { obterEdicaoPrograma } from '@/services/edicaoPrograma/obterEdicaoPrograma'
import { useQuery } from '@tanstack/react-query'

export function useGetEdicaoPrograma(uuid: string | undefined) {
  return useQuery({
    queryKey: ['edicaoPrograma', uuid],
    queryFn: () => obterEdicaoPrograma(uuid as string),
    enabled: Boolean(uuid),
  })
}

export default useGetEdicaoPrograma
