import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { atualizarDefinicaoPolo } from '@/services/definicaoPolo/atualizarDefinicaoPolo'
import type { DadosAtualizacaoDefinicaoPolo } from '@/services/definicaoPolo/types'

export function usePutDefinicaoPolo(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosAtualizacaoDefinicaoPolo) => {
      if (!uuid) {
        throw new Error('UUID da definição do polo não informado.')
      }

      return atualizarDefinicaoPolo(uuid, dados)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['definicoesPolo'] })

      if (uuid) {
        void queryClient.invalidateQueries({
          queryKey: ['definicaoPolo', uuid],
        })
      }
    },
  })
}

export default usePutDefinicaoPolo
