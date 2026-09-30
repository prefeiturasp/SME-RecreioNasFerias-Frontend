import { useQuery } from '@tanstack/react-query'
import { listarPolosElegiveis } from '@/services/inscricao/listarPolosElegiveis'

export function useGetPolosElegiveis(dreCodigoEol: string) {
  return useQuery({
    queryKey: ['polosElegiveis', dreCodigoEol],
    queryFn: () => listarPolosElegiveis(dreCodigoEol),
    enabled: Boolean(dreCodigoEol),
  })
}

export default useGetPolosElegiveis
