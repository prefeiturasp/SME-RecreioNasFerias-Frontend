import { Cabecalho } from '../../components/Cabecalho'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import { AreaConteudo, ContainerPaginaInicial, SecaoPrincipal } from './style'

export default function PaginaInicial() {
  return (
    <ContainerPaginaInicial>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[{ rotulo: 'Início' }]} />
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaInicial>
  )
}
