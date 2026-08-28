import { useQuery } from '@tanstack/react-query'
import { listarPolos } from '@/services/polo/listarPolos'
import type { PoloDetalhado } from '@/services/polo/types'

export function useGetPolos(
  busca?: string,
  dre_codigo_eol?: string,
  tipo_ue?: string,
) {
  return useQuery<PoloDetalhado[], Error>({
    queryKey: ['polos', busca, dre_codigo_eol, tipo_ue],
    queryFn: () => listarPolos(busca, dre_codigo_eol, tipo_ue),
  })
}

export default useGetPolos
