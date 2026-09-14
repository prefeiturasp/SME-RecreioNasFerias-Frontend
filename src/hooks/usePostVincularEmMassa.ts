import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { vincularEmMassa } from '@/services/definicaoPolo/vincularEmMassa'

export function usePostVincularEmMassa() {
  return useMutation({
    mutationFn: vincularEmMassa,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
    },
  })
}

export default usePostVincularEmMassa
