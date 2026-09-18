import { useMutation } from '@tanstack/react-query'
import { obterDadosDaUnidade } from '@/services/polo/obterDadosDaUnidade'

export function useGetDadosDaUnidade() {
  return useMutation({ mutationFn: obterDadosDaUnidade })
}

export default useGetDadosDaUnidade
