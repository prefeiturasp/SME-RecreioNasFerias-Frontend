import { useQuery } from '@tanstack/react-query'
import { listarTiposEscolaPolo } from '@/services/polo/listarTiposEscolaPolo'

export function useGetTiposEscolaPolo() {
  return useQuery({
    queryKey: ['tiposEscolaPolo'],
    queryFn: () => listarTiposEscolaPolo(),
  })
}

export default useGetTiposEscolaPolo
