import { useMutation } from '@tanstack/react-query'
import { cadastrarPolo } from '@/services/polo/cadastrarPolo'

export function usePostPolo() {
  return useMutation({ mutationFn: cadastrarPolo })
}

export default usePostPolo
