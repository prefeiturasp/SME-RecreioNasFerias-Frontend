import { useMutation } from '@tanstack/react-query'
import { obterDadosDaUnidade } from '@/services/polo/obterDadosDaUnidade'

export function useGetDadosDaUnidade() {
  return useMutation({
    mutationFn: async (codigoEol: string) => {
      const unidade = await obterDadosDaUnidade(codigoEol)

      if (!unidade.codigo_eol.trim()) {
        throw new Error()
      }

      return unidade
    },
  })
}

export default useGetDadosDaUnidade
