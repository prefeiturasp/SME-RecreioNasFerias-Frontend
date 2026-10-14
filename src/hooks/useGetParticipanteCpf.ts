import { useQuery } from '@tanstack/react-query'
import { obterParticipanteCpf } from '@/services/inscricao/obterParticipanteCpf'

export function useGetParticipanteCpf(cpf: string | undefined) {
  return useQuery({
    queryKey: ['participante-cpf', cpf],
    queryFn: () => {
      if (!cpf) {
        throw new Error('CPF não informado.')
      }

      return obterParticipanteCpf(cpf)
    },
    enabled: Boolean(cpf),
    retry: false,
  })
}

export default useGetParticipanteCpf
