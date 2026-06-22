import { useCallback, useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'

import { Cabecalho } from '../../components/Cabecalho'

import { MapaVisual } from '../../components/MapaVisual'

import { MenuLateral } from '../../components/MenuLateral'

import { listarEdicoesPrograma } from '../../services/edicaoPrograma/api'

import type { EdicaoPrograma } from '../../services/edicaoPrograma/types'

import { MensagemSucessoAoCriarNovaEdicaoPrograma } from './MensagemSucessoAoCriarNovaEdicaoPrograma'

import { OPCOES_ITENS_POR_PAGINA } from './constantesPaginacao'

import { TabelaListagemEdicoesPrograma } from './TabelaListagemEdicoesPrograma'

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

  const [edicoes, setEdicoes] = useState<EdicaoPrograma[]>([])

  const [paginaAtual, setPaginaAtual] = useState(1)

  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )

  const [totalPaginas, setTotalPaginas] = useState(0)

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  const carregarEdicoes = useCallback(
    (pagina: number, tamanhoPagina: number) => {
      void listarEdicoesPrograma({ pagina, tamanhoPagina })
        .then((listagem) => {
          setEdicoes(listagem.edicoes)

          setPaginaAtual(listagem.pagina)

          setItensPorPagina(listagem.tamanhoPagina)

          setTotalPaginas(listagem.totalPaginas)
        })

        .catch(() => {
          setEdicoes([])

          setTotalPaginas(0)
        })
    },
    [],
  )

  useEffect(() => {
    carregarEdicoes(paginaAtual, itensPorPagina)
  }, [carregarEdicoes, itensPorPagina, paginaAtual])

  useEffect(() => {
    if (!estadoNavegacao?.edicaoCadastrada) return

    navigate('/edicoes-programa', { replace: true })
  }, [estadoNavegacao?.edicaoCadastrada, navigate])

  const mudarItensPorPagina = useCallback((novoTamanhoPagina: number) => {
    setItensPorPagina(novoTamanhoPagina)

    setPaginaAtual(1)
  }, [])

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
              <TabelaListagemEdicoesPrograma
                edicoes={edicoes}
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                itensPorPagina={itensPorPagina}
                onMudarPagina={setPaginaAtual}
                onMudarItensPorPagina={mudarItensPorPagina}
                onEditarEdicao={(idEdicao) =>
                  navigate(`/editar-edicao-programa/${idEdicao}`)
                }
              />
            </ListagemEdicoesPrograma>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEdicoesPrograma>
  )
}
