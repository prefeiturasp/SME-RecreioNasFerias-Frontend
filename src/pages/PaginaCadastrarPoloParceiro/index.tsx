import { useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { PoloForm } from '@/components/polo/PoloForm'
import {
  AreaConteudo,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaCadastrarPoloParceiro,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Cadastro de Polos Parceiros', caminho: '/polos-parceiros' },
  { rotulo: 'Cadastrar Polo Parceiro' },
] as const

export default function PaginaCadastrarPoloParceiro() {
  const navigate = useNavigate()

  return (
    <ContainerPaginaCadastrarPoloParceiro>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Cadastrar Polo Parceiro</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar para cadastro de polos parceiros"
                  onClick={() => navigate('/polos-parceiros')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>
            <PoloForm />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaCadastrarPoloParceiro>
  )
}
