import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Cabecalho } from '../../components/Cabecalho'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import { MensagemSucessoAoCadastrarPoloParceiro } from './MensagemSucessoAoCadastrarPoloParceiro'
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

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Cadastro de Polos Parceiros' },
] as const

export default function PaginaPolosParceiros() {
  const navigate = useNavigate()
  const location = useLocation()
  const estadoNavegacao = location.state as EstadoNavegacaoPolosParceiros | null

  const [mensagemSucessoVisivel, setMensagemSucessoVisivel] = useState(
    Boolean(estadoNavegacao?.poloCadastrado),
  )

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  useEffect(() => {
    if (!estadoNavegacao?.poloCadastrado) return

    navigate('/polos-parceiros', { replace: true })
  }, [estadoNavegacao?.poloCadastrado, navigate])

  return (
    <ContainerPaginaPolosParceiros>
      <MenuLateral />

      <SecaoPrincipal>
        <Cabecalho />

        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <MensagemSucessoAoCadastrarPoloParceiro
            visivel={mensagemSucessoVisivel}
            onFechar={fecharMensagemSucesso}
          />

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
