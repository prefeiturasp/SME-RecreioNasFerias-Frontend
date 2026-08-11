import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '@/components/shared/menu-lateral'
import { AreaConteudo, ContainerPaginaInicial, SecaoPrincipal } from './style'

export default function PaginaInicial() {
  return (
    <ContainerPaginaInicial>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[{ rotulo: 'Início' }]} />
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaInicial>
  )
}
