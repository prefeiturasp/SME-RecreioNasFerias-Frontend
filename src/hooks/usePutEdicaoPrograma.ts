import { atualizarEdicaoPrograma } from '@/services/edicaoPrograma/atualizarEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma } from '@/services/edicaoPrograma/types'
import { useMutation } from '@tanstack/react-query'

export function usePutEdicaoPrograma(uuid: string | undefined) {
  return useMutation({
    mutationFn: (dados: DadosCadastroEdicaoPrograma) =>
      atualizarEdicaoPrograma(uuid as string, dados),
  })
}

export default usePutEdicaoPrograma
