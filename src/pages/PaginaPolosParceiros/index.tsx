import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { OPCOES_ITENS_POR_PAGINA } from '../../components/ListagemTabela/constantesPaginacao'
import { Cabecalho } from '../../components/Cabecalho'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import { listarPolosParceiros } from '../../services/poloParceiro/api'
import {
  FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
  type FiltrosListagemPolosParceiros,
  type PoloParceiro,
} from '../../services/poloParceiro/types'

import { FiltrosPolosParceiros } from './FiltrosPolosParceiros'
import { MensagemSucessoAoCadastrarPoloParceiro } from './MensagemSucessoAoCadastrarPoloParceiro'
import { TabelaListagemPolosParceiros } from './TabelaListagemPolosParceiros'
import type { EstadoNavegacaoPolosParceiros } from './types'
import {
  AreaConteudo,
  BotaoAdicionarPoloParceiro,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  CartaoListagemPolosParceiros,
  ContainerPaginaPolosParceiros,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

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

  const [filtros, setFiltros] = useState<FiltrosListagemPolosParceiros>(
    FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
  )
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosListagemPolosParceiros>(
      FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
    )
  const [polos, setPolos] = useState<PoloParceiro[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [estaCarregandoListagem, setEstaCarregandoListagem] = useState(true)

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  const carregarPolos = useCallback(
    (
      pagina: number,
      tamanhoPagina: number,
      filtrosListagem: FiltrosListagemPolosParceiros,
    ) => {
      setEstaCarregandoListagem(true)

      void listarPolosParceiros({
        pagina,
        tamanhoPagina,
        ...filtrosListagem,
      })
        .then((listagem) => {
          setPolos(listagem.polos)
          setPaginaAtual(listagem.pagina)
          setItensPorPagina(listagem.tamanhoPagina)
          setTotalPaginas(listagem.totalPaginas)
        })
        .catch(() => {
          setPolos([])
          setTotalPaginas(0)
        })
        .finally(() => {
          setEstaCarregandoListagem(false)
        })
    },
    [],
  )

  useEffect(() => {
    carregarPolos(paginaAtual, itensPorPagina, filtrosAplicados)
  }, [carregarPolos, filtrosAplicados, itensPorPagina, paginaAtual])

  useEffect(() => {
    if (!estadoNavegacao?.poloCadastrado) return

    navigate('/polos-parceiros', { replace: true })
  }, [estadoNavegacao?.poloCadastrado, navigate])

  const mudarItensPorPagina = useCallback((novoTamanhoPagina: number) => {
    setItensPorPagina(novoTamanhoPagina)
    setPaginaAtual(1)
  }, [])

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtros)
    setPaginaAtual(1)
  }

  const limparFiltros = () => {
    setFiltros(FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS)
    setFiltrosAplicados(FILTROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS)
    setPaginaAtual(1)
  }

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

            <FiltrosPolosParceiros
              valores={filtros}
              onChange={setFiltros}
              onLimpar={limparFiltros}
              onFiltrar={aplicarFiltros}
            />

            <CartaoListagemPolosParceiros>
              {estaCarregandoListagem ? (
                <IndicadorCarregamento mensagem="Carregando polos parceiros..." />
              ) : (
                <TabelaListagemPolosParceiros
                  polos={polos}
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  itensPorPagina={itensPorPagina}
                  onMudarPagina={setPaginaAtual}
                  onMudarItensPorPagina={mudarItensPorPagina}
                  onEditarPolo={(idPolo) =>
                    navigate(`/editar-polo-parceiro/${idPolo}`)
                  }
                />
              )}
            </CartaoListagemPolosParceiros>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaPolosParceiros>
  )
}
