import { useMutation } from '@tanstack/react-query'
import { atualizarPolo } from '@/services/polo/atualizarPolo'
import type { DadosCadastroPolo } from '@/services/polo/types'

export function usePutPolo(id: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroPolo) => {
      if (!id) {
        throw new Error('Id do polo não informado.')
      }

      return atualizarPolo(id, dados)
    },
  })
}

export default usePutPolo
