import { useMutation } from '@tanstack/react-query'
import { atualizarPolo } from '@/services/polo/atualizarPolo'
import type { DadosCadastroPolo } from '@/services/polo/types'

export function usePutPolo(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroPolo) => {
      if (!uuid) {
        throw new Error('UUID do polo não informado.')
      }

      return atualizarPolo(uuid, dados)
    },
  })
}

export default usePutPolo
