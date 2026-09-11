import { Cabecalho } from '@/components/Cabecalho'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'

export default function PaginaInicial() {
  return (
    <main className="flex h-full w-full overflow-hidden">
      <MenuLateral />

      <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
        <Cabecalho />

        <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
          <MapaVisual niveis={[{ rotulo: 'Início' }]} />
        </div>
      </section>
    </main>
  )
}
