<<<<<<< HEAD
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
=======
import { useMutation } from '@tanstack/react-query'
import { obterParticipanteCpf } from '@/services/inscricao/obterParticipanteCpf'

export function useGetParticipanteCpf() {
  return useMutation({ mutationFn: obterParticipanteCpf })
>>>>>>> d74c94eaccd1f5bb90a37aec09916769db4bb568
}

export default useGetParticipanteCpf
