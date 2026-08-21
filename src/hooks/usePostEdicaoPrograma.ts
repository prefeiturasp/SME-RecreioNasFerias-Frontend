import { cadastrarEdicaoPrograma } from '@/services/edicaoPrograma/cadastrarEdicaoPrograma'
import { useMutation } from '@tanstack/react-query'

export function usePostEdicaoPrograma() {
  return useMutation({ mutationFn: cadastrarEdicaoPrograma })
}

export default usePostEdicaoPrograma
