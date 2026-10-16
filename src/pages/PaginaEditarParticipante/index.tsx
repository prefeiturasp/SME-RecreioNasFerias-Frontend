import { useNavigate, useParams } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { ParticipanteForm } from '@/components/participante/ParticipanteForm'
import { Button } from '@/components/ui/button'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Inscrições' },
  { rotulo: 'Inscrições de Participantes', caminho: '/inscricoes-participantes' },
  { rotulo: 'Editar Participante' },
] as const

export default function PaginaEditarParticipante() {
  const navigate = useNavigate()
  const { inscricaoUuid } = useParams()

  return (
    <main className="flex h-full w-full overflow-hidden">
      <MenuLateral />
      <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
        <Cabecalho />
        <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
              <h3 className="text-xl leading-tight font-bold">
                Editar Participante
              </h3>
              <Button
                type="button"
                variant="outline"
                aria-label="Voltar para inscrições de participantes"
                className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
                onClick={() => navigate('/inscricoes-participantes')}
              >
                <img src={IconeSetaVoltar} alt="" aria-hidden="true" /> Voltar
              </Button>
            </div>
            {inscricaoUuid ? (
              <ParticipanteForm inscricaoUuid={inscricaoUuid} />
            ) : null}
          </section>
        </div>
      </section>
    </main>
  )
}