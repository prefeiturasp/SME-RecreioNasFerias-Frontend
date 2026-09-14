import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { alterarTipoEmMassa } from '@/services/definicaoPolo/alterarTipoEmMassa'

export function usePostAlterarTipoEmMassa() {
  return useMutation({
    mutationFn: alterarTipoEmMassa,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
    },
  })
}

export default usePostAlterarTipoEmMassa
