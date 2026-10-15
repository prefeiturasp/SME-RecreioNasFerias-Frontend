import { FiltrosInscricoesParticipantesForm } from './FiltrosInscricoesParticipantesForm'
import { InscricoesParticipantesListagem } from '../InscricoesParticipantesListagem'

export function InscricoesParticipantesConteudo() {
  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <FiltrosInscricoesParticipantesForm />

      <InscricoesParticipantesListagem />
    </div>
  )
}
