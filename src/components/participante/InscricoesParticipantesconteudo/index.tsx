import { FiltrosInscricoesParticipantesForm } from './FiltrosInscricoesParticipantesForm'
import { useGetInscricoes } from '@/hooks/useGetInscricoes'

export function InscricoesParticipantesConteudo() {
  const inscricoesQuery = useGetInscricoes()
  console.log(inscricoesQuery)

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <FiltrosInscricoesParticipantesForm />
    </div>
  )
}
