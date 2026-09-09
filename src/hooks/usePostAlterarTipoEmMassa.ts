import { useMutation } from '@tanstack/react-query'
import { alterarTipoEmMassa } from '@/services/definicaoPolo/alterarTipoEmMassa'

export function usePostAlterarTipoEmMassa() {
  return useMutation({ mutationFn: alterarTipoEmMassa })
}

export default usePostAlterarTipoEmMassa
