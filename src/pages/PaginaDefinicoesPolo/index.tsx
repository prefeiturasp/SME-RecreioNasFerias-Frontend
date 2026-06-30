import { useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'

import { Cabecalho } from '../../components/Cabecalho'

import { MapaVisual } from '../../components/MapaVisual'

import { MenuLateral } from '../../components/MenuLateral'

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
  { rotulo: 'Definições de Polo' },
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
              <h3>Definições de Polo</h3>

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
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaDefinicoesPolo>
  )
}
