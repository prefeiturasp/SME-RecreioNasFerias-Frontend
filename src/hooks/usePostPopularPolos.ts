import { useMutation } from '@tanstack/react-query'
import { popularPolos } from '@/services/definicaoPolo/popularPolos'

export function usePostPopularPolos() {
  return useMutation({ mutationFn: popularPolos })
}

export default usePostPopularPolos
