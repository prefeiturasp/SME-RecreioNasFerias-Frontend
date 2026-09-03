import { useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { DefinicaoPolosConteudo } from '@/components/definicaoPolo/DefinicaoPolosConteudo'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import {
  AreaConteudo,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
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
            <CabecalhoAreaInternaConteudo>
              <h3>Definição de Polos</h3>

              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar ao início"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />

                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>

            <DefinicaoPolosConteudo />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaDefinicoesPolo>
  )
}
