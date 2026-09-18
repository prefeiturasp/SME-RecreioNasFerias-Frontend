import { useQuery } from '@tanstack/react-query'
import { obterDadosDaUnidade } from '@/services/polo/obterDadosDaUnidade'

export function useGetDadosDaUnidade(codigoEol: string | undefined) {
  return useQuery({
    queryKey: ['dadosDaUnidade', codigoEol],
    queryFn: () => {
      if (!codigoEol) {
        throw new Error('Código EOL não informado.')
      }

      return obterDadosDaUnidade(codigoEol)
    },
    enabled: Boolean(codigoEol),
  })
}

export default useGetDadosDaUnidade
