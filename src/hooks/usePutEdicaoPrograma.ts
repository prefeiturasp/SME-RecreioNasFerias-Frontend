import { useMutation } from '@tanstack/react-query'
import { atualizarEdicaoPrograma } from '@/services/edicaoPrograma/atualizarEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma } from '@/services/edicaoPrograma/types'

export function usePutEdicaoPrograma(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroEdicaoPrograma) => {
      if (!uuid) {
        throw new Error('UUID da edição não informado.')
      }

      return atualizarEdicaoPrograma(uuid, dados)
    },
  })
}

export default usePutEdicaoPrograma
