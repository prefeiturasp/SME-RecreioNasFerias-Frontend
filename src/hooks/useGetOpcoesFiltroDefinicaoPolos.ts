import { useQuery } from '@tanstack/react-query'
import { listarOpcoesFiltroDefinicaoPolos } from '@/services/definicaoPolo/listarOpcoesFiltroDefinicaoPolos'
import type { OpcoesFiltroDefinicaoPolos } from '@/services/definicaoPolo/types'

export function useGetOpcoesFiltroDefinicaoPolos() {
  return useQuery<OpcoesFiltroDefinicaoPolos, Error>({
    queryKey: ['opcoesFiltroDefinicaoPolos'],
    queryFn: () => listarOpcoesFiltroDefinicaoPolos(),
  })
}

export default useGetOpcoesFiltroDefinicaoPolos
