import { useQuery } from '@tanstack/react-query'
import { checarDuplicidadeInscricaoEstudanteExterno } from '@/services/inscricao/checarDuplicidadeInscricaoEstudanteExterno'

export function useGetDuplicidadeCPFInscricaoExterna(
  cpf: string,
  habilitada = true,
) {
  return useQuery({
    queryKey: ['duplicidade-cpf', cpf],
    queryFn: () => checarDuplicidadeInscricaoEstudanteExterno(cpf),
    enabled: habilitada && /^\d{11}$/.test(cpf),
  })
}
