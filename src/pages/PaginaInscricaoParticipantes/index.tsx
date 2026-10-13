import { useNavigate } from 'react-router-dom'
import { MenuLateral } from '../../components/MenuLateral'
import { Cabecalho } from '../../components/Cabecalho'
import { MapaVisual } from '../../components/MapaVisual'
import { Button } from '@/components/ui/button'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { InscricoesParticipantesConteudo } from '@/components/participante/InscricoesParticipantesconteudo'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Inscrições' },
  { rotulo: 'Inscrições de Participantes' },
] as const

export default function PaginaInscricaoParticipantes() {
  const navigate = useNavigate()

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
                Inscrições de Participantes
              </h3>
              <div className="flex flex-wrap items-center justify-end gap-2.5 max-md:flex-col max-md:items-stretch max-md:[&>button]:w-full">
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Voltar para o início"
                  className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" /> Voltar
                </Button>

                <Button
                  type="button"
                  variant="default"
                  aria-label="Cadastrar Participante"
                  className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-white hover:bg-accent hover:text-brand-dark"
                  onClick={() => navigate('/inscricoes-participantes/cadastro')}
                >
                  Cadastrar Participante
                </Button>
              </div>
            </div>

            <InscricoesParticipantesConteudo />
          </section>
        </div>
      </section>
    </main>
  )
}
