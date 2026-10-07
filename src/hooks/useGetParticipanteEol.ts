import { useMutation } from '@tanstack/react-query'
import { obterParticipanteEol } from '@/services/inscricao/obterParticipanteEol'

export function useGetParticipanteEol() {
  return useMutation({ mutationFn: obterParticipanteEol })
}

export default useGetParticipanteEol
