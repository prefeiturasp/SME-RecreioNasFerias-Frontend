import { useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { DefinicaoPolosConteudo } from '@/components/definicaoPolo/DefinicaoPolosConteudo'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import {
  AreaConteudo,
  BotaoVoltar,
  ContainerPaginaDefinicoesPolo,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Definição de Polos' },
] as const

export default function PaginaDefinicoesPolo() {
  const navigate = useNavigate()

  return (
    <ContainerPaginaDefinicoesPolo>
      <MenuLateral />

      <SecaoPrincipal>
        <Cabecalho />

        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <section>
            <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
              <h3 className="text-xl leading-tight font-bold text-foreground">
                Definição de Polos
              </h3>

              <div className="flex flex-wrap items-center justify-end gap-2.5 max-md:flex-col max-md:items-stretch [&_button]:max-md:w-full">
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar ao início"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />

                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </div>

            <DefinicaoPolosConteudo />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaDefinicoesPolo>
  )
}
