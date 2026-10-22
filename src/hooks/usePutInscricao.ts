import { useMutation } from '@tanstack/react-query'
import { atualizarInscricao } from '@/services/inscricao/atualizarInscricao'
import type { DadosCadastroInscricao } from '@/services/inscricao/types'

export function usePutInscricao(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroInscricao) => {
      if (!uuid) {
        throw new Error('UUID da inscrição não informado.')
      }

      return atualizarInscricao(uuid, dados)
    },
  })
}

export default usePutInscricao
