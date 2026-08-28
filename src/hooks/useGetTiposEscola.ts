import { useQuery } from '@tanstack/react-query'
import { listarTiposEscola } from '@/services/tipoEscola/listarTiposEscola'
import type { TipoEscola } from '@/services/tipoEscola/types'

export function useGetTiposEscola() {
  return useQuery<TipoEscola[], Error>({
    queryKey: ['tipos-escola'],
    queryFn: listarTiposEscola,
  })
}

export default useGetTiposEscola
