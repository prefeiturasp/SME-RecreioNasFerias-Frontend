import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Cabecalho } from '../../components/Cabecalho'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import type { EstadoNavegacaoPolosParceiros } from './types'
import {
  AreaConteudo,
  BotaoAdicionarPoloParceiro,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaPolosParceiros,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'
import PoloListagem from '@/components/polo/PoloListagem'
import { useToast } from '@/hooks/useToast'

const TOAST_SUCESSO_CADASTRO_ID = 'polo-parceiro-cadastrado'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Cadastro de Polos Parceiros' },
] as const

export default function PaginaPolosParceiros() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const estadoNavegacao = location.state as EstadoNavegacaoPolosParceiros | null

  useEffect(() => {
    if (!estadoNavegacao?.poloCadastrado) return

    showToast({
      id: TOAST_SUCESSO_CADASTRO_ID,
      variant: 'success',
      description: 'Polo Parceiro cadastrado com sucesso!',
      duration: 3000,
    })
    navigate('/polos-parceiros', { replace: true })
  }, [estadoNavegacao?.poloCadastrado, navigate, showToast])

  return (
    <ContainerPaginaPolosParceiros>
      <MenuLateral />

      <SecaoPrincipal>
        <Cabecalho />

        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Cadastro de Polos Parceiros</h3>

              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar ao início"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>

                <BotaoAdicionarPoloParceiro
                  type="button"
                  onClick={() => navigate('/cadastrar-polo-parceiro')}
                >
                  Adicionar Polo Parceiro
                </BotaoAdicionarPoloParceiro>
              </div>
            </CabecalhoAreaInternaConteudo>

            <PoloListagem />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaPolosParceiros>
  )
}
