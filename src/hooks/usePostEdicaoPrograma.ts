import { useMutation } from '@tanstack/react-query'
import { cadastrarEdicaoPrograma } from '@/services/edicaoPrograma/cadastrarEdicaoPrograma'

export function usePostEdicaoPrograma() {
  return useMutation({ mutationFn: cadastrarEdicaoPrograma })
}

export default usePostEdicaoPrograma
