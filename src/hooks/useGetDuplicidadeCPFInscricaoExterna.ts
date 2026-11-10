import { useQuery } from '@tanstack/react-query'
import { checarDuplicidadeInscricaoEstudanteExterno } from '@/services/inscricao/checarDuplicidadeInscricaoEstudanteExterno'

export function useGetDuplicidadeCPFInscricaoExterna(cpf: string) {
  return useQuery({
    queryKey: ['duplicidade-cpf', cpf],
    queryFn: () => checarDuplicidadeInscricaoEstudanteExterno(cpf),
    enabled: /^\d{11}$/.test(cpf),
  })
}
