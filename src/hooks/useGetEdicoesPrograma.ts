import { useQuery } from '@tanstack/react-query'
import { listarEdicoesPrograma } from '@/services/edicaoPrograma/listarEdicoesPrograma'

export function useGetEdicoesPrograma(enabled = true) {
  return useQuery({
    queryKey: ['edicoesPrograma'],
    queryFn: () => listarEdicoesPrograma(),
    enabled,
  })
}

export default useGetEdicoesPrograma
