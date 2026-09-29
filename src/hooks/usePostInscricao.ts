import { useMutation } from '@tanstack/react-query'
import { cadastrarInscricao } from '@/services/inscricao/cadastrarInscricao'

export function usePostInscricao() {
  return useMutation({ mutationFn: cadastrarInscricao })
}

export default usePostInscricao
