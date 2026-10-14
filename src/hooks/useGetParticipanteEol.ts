import { useQuery } from '@tanstack/react-query'
import { obterParticipanteEol } from '@/services/inscricao/obterParticipanteEol'

export function useGetParticipanteEol(codigoEol: string | undefined) {
  return useQuery({
    queryKey: ['participante-eol', codigoEol],
    queryFn: () => {
      if (!codigoEol) {
        throw new Error('Código EOL não informado.')
      }

      return obterParticipanteEol(codigoEol)
    },
    enabled: Boolean(codigoEol),
    retry: false,
  })
}

export default useGetParticipanteEol
