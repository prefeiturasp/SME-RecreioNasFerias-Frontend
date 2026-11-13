import { useQuery } from '@tanstack/react-query'
import { obterParticipanteEol } from '@/services/inscricao/obterParticipanteEol'

export function useGetParticipanteEol(
  codigoEol: string | undefined,
  inscricaoId?: string,
) {
  return useQuery({
    queryKey: ['participante-eol', codigoEol, inscricaoId ?? null],
    queryFn: () => {
      if (!codigoEol) {
        throw new Error('Código EOL não informado.')
      }

      return inscricaoId
        ? obterParticipanteEol(codigoEol, inscricaoId)
        : obterParticipanteEol(codigoEol)
    },
    enabled: Boolean(codigoEol),
    retry: false,
  })
}

export default useGetParticipanteEol
