import { useMutation } from '@tanstack/react-query'
import { atualizarDefinicoesPoloEmLote } from '@/services/definicaoPolo/atualizarDefinicoesPoloEmLote'

export function usePatchDefinicoesPoloEmLote() {
  return useMutation({ mutationFn: atualizarDefinicoesPoloEmLote })
}

export default usePatchDefinicoesPoloEmLote
