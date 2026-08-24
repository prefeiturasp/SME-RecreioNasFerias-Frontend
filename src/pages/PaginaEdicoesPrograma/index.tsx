import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Cabecalho } from '../../components/Cabecalho'
import { EdicaoListagem } from '../../components/edicaoPrograma/EdicaoListagem'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import { MensagemSucessoAoCriarNovaEdicaoPrograma } from './MensagemSucessoAoCriarNovaEdicaoPrograma'
import {
  AreaConteudo,
  BotaoCadastrarNovaEdicao,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaEdicoesPrograma,
  ListagemEdicoesPrograma,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'
import type { EstadoNavegacaoEdicoesPrograma } from './types'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Edições do programa' },
] as const

export default function PaginaEdicoesPrograma() {
  const navigate = useNavigate()
  const location = useLocation()
  const estadoNavegacao =
    location.state as EstadoNavegacaoEdicoesPrograma | null
  const [mensagemSucessoVisivel, setMensagemSucessoVisivel] = useState(
    Boolean(estadoNavegacao?.edicaoCadastrada),
  )

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  useEffect(() => {
    if (!estadoNavegacao?.edicaoCadastrada) return

    navigate('/edicoes-programa', { replace: true })
  }, [estadoNavegacao?.edicaoCadastrada, navigate])

  return (
    <ContainerPaginaEdicoesPrograma>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <MensagemSucessoAoCriarNovaEdicaoPrograma
            visivel={mensagemSucessoVisivel}
            onFechar={fecharMensagemSucesso}
          />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Edições do Programa</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar ao início"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
                <BotaoCadastrarNovaEdicao
                  type="button"
                  onClick={() => navigate('/cadastrar-nova-edicao-programa')}
                >
                  Cadastrar Nova Edição do Programa
                </BotaoCadastrarNovaEdicao>
              </div>
            </CabecalhoAreaInternaConteudo>
            <ListagemEdicoesPrograma>
              <EdicaoListagem />
            </ListagemEdicoesPrograma>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEdicoesPrograma>
  )
}
