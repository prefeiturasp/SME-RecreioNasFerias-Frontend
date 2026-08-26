import { useNavigate, useParams } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { EdicaoForm } from '@/components/edicaoPrograma/EdicaoForm'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import {
  AreaConteudo,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaEdicoesPrograma,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Edições do programa', caminho: '/edicoes-programa' },
  { rotulo: 'Editar Edição do Programa' },
] as const

export default function PaginaEditarEdicaoPrograma() {
  const navigate = useNavigate()
  const { idEdicao } = useParams()

  return (
    <ContainerPaginaEdicoesPrograma>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Editar Edição do Programa</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar para edições do programa"
                  onClick={() => navigate('/edicoes-programa')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>
            {idEdicao ? <EdicaoForm edicaoId={idEdicao} /> : null}
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEdicoesPrograma>
  )
}
