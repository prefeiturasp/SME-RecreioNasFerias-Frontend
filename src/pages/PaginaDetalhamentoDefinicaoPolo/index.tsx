import { useNavigate, useParams } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { DefinicaoPoloForm } from '@/components/definicaoPolo/DefinicaoPoloForm'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { Button } from '@/components/ui/button'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Definição de Polos', caminho: '/definicoes-polo' },
  { rotulo: 'Detalhamento do Polo' },
] as const

export default function PaginaDetalhamentoDefinicaoPolo() {
  const navigate = useNavigate()
  const { idDefinicao } = useParams()

  return (
    <main className="flex h-full w-full overflow-hidden">
      <MenuLateral />

      <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
        <Cabecalho />

        <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <section>
            <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
              <h3 className="text-xl leading-tight font-bold text-foreground">
                Detalhamento do Polo
              </h3>

              <div className="flex flex-wrap items-center justify-end gap-2.5 max-md:flex-col max-md:items-stretch [&_button]:max-md:w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex h-9.5 items-center gap-2.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
                  aria-label="Voltar para definição de polos"
                  onClick={() => navigate('/definicoes-polo')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <span>Voltar</span>
                </Button>
              </div>
            </div>

            {idDefinicao ? (
              <DefinicaoPoloForm definicaoUuid={idDefinicao} />
            ) : null}
          </section>
        </div>
      </section>
    </main>
  )
}
