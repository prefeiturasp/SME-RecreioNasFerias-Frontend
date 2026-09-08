import { useMutation } from '@tanstack/react-query'
import { vincularEmMassa } from '@/services/definicaoPolo/vincularEmMassa'

export function usePostVincularEmMassa() {
  return useMutation({ mutationFn: vincularEmMassa })
}

export default usePostVincularEmMassa
