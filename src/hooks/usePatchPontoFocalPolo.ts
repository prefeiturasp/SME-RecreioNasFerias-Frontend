import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { atualizarPontoFocalPolo } from '@/services/polo/atualizarPontoFocalPolo'
import type { DadosPontoFocalPolo } from '@/services/polo/types'

export function usePatchPontoFocalPolo(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosPontoFocalPolo) => {
      if (!uuid) {
        throw new Error('UUID do polo não informado.')
      }

      return atualizarPontoFocalPolo(uuid, dados)
    },
    onSuccess: () => {
      if (uuid) {
        void queryClient.invalidateQueries({ queryKey: ['polo', uuid] })
      }
      void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })
      void queryClient.invalidateQueries({ queryKey: ['definicaoPolo'] })
    },
  })
}

export default usePatchPontoFocalPolo
