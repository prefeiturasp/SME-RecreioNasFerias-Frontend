import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
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
    onSuccess: async () => {
      if (uuid) {
        await queryClient.invalidateQueries({ queryKey: ['inscricao', uuid] })
      }
      await queryClient.invalidateQueries({ queryKey: ['inscricoes'] })
    },
  })
}

export default usePutInscricao
