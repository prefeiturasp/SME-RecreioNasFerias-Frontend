import { cadastrarEdicaoPrograma } from '@/services/edicaoPrograma/api'
import { useMutation } from '@tanstack/react-query'

export function usePostEdicaoPrograma() {
  return useMutation({ mutationFn: cadastrarEdicaoPrograma })
}

export default usePostEdicaoPrograma
