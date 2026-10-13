import { useMutation } from '@tanstack/react-query'
import { obterParticipanteCpf } from '@/services/inscricao/obterParticipanteCpf'

export function useGetParticipanteCpf() {
  return useMutation({ mutationFn: obterParticipanteCpf })
}

export default useGetParticipanteCpf
