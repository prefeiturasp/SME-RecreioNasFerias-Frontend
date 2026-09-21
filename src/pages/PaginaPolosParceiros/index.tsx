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
const TOAST_SUCESSO_EDICAO_ID = 'polo-parceiro-atualizado'

function obterToastSucesso(estado: EstadoNavegacaoPolosParceiros | null) {
  if (estado?.poloCadastrado) {
    return {
      id: TOAST_SUCESSO_CADASTRO_ID,
      description: 'Polo Parceiro cadastrado com sucesso!',
    }
  }

  if (estado?.poloAtualizado) {
    return {
      id: TOAST_SUCESSO_EDICAO_ID,
      description: 'Polo Parceiro atualizado com sucesso!',
    }
  }

  return null
}

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
    const toastSucesso = obterToastSucesso(estadoNavegacao)
    if (!toastSucesso) return

    showToast({
      ...toastSucesso,
      variant: 'success',
      duration: 3000,
    })
    navigate('/polos-parceiros', { replace: true })
  }, [estadoNavegacao, navigate, showToast])

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
