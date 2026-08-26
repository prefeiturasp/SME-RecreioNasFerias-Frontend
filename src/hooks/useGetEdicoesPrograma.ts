import { useQuery } from '@tanstack/react-query'
import { listarEdicoesPrograma } from '@/services/edicaoPrograma/listarEdicoesPrograma'

export function useGetEdicoesPrograma() {
  return useQuery({
    queryKey: ['edicoesPrograma'],
    queryFn: () => listarEdicoesPrograma(),
  })
}

export default useGetEdicoesPrograma
