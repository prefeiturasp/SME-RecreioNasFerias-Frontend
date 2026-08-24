import { useMutation } from '@tanstack/react-query'
import { atualizarEdicaoPrograma } from '@/services/edicaoPrograma/atualizarEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma } from '@/services/edicaoPrograma/types'

export function usePutEdicaoPrograma(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroEdicaoPrograma) =>
      atualizarEdicaoPrograma(uuid as string, dados),
  })
}

export default usePutEdicaoPrograma
