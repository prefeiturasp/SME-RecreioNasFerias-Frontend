import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import IconeSetaVoltar from '@/assets/icone-seta-voltar.png'
import { Cabecalho } from '@/components/Cabecalho'
import { EdicaoListagem } from '@/components/edicaoPrograma/EdicaoListagem'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { MensagemSucessoEdicaoPrograma } from './MensagemSucessoEdicaoPrograma'
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

const MENSAGEM_SUCESSO_CADASTRO = 'Edição do Programa cadastrado com sucesso!'
const MENSAGEM_SUCESSO_ATUALIZACAO =
  'Edição do Programa atualizada com sucesso!'

function obterMensagemSucesso(estado: EstadoNavegacaoEdicoesPrograma | null) {
  if (estado?.edicaoCadastrada) return MENSAGEM_SUCESSO_CADASTRO
  if (estado?.edicaoAtualizada) return MENSAGEM_SUCESSO_ATUALIZACAO
  return null
}

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
  const [mensagemSucesso, setMensagemSucesso] = useState(
    obterMensagemSucesso(estadoNavegacao),
  )

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucesso(null)
  }, [])

  useEffect(() => {
    if (
      !estadoNavegacao?.edicaoCadastrada &&
      !estadoNavegacao?.edicaoAtualizada
    )
      return

    navigate('/edicoes-programa', { replace: true })
  }, [
    estadoNavegacao?.edicaoCadastrada,
    estadoNavegacao?.edicaoAtualizada,
    navigate,
  ])

  return (
    <ContainerPaginaEdicoesPrograma>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <MensagemSucessoEdicaoPrograma
            visivel={Boolean(mensagemSucesso)}
            mensagem={mensagemSucesso ?? undefined}
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
