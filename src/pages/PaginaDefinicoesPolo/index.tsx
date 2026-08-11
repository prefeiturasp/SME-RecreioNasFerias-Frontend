import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { OPCOES_ITENS_POR_PAGINA } from '../../components/ListagemTabela/constantesPaginacao'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '@/components/shared/menu-lateral'
import {
  atualizarDefinicoesPoloEmLote,
  ErroAtualizacaoDefinicoesPolo,
  listarDefinicoesPolo,
  sincronizarUnidadesDiretas,
} from '../../services/definicaoPolo/api'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type DefinicaoPolo,
  type FiltrosListagemDefinicaoPolos,
} from '../../services/definicaoPolo/types'

import { FiltrosDefinicaoPolos } from './FiltrosDefinicaoPolos'
import { ModalAlterarEdicaoDoPolo } from './ModalAlterarEdicaoDoPolo'
import { ModalAlterarTipoDePolo } from './ModalAlterarTipoDePolo'
import { TabelaDefinicaoPolos } from './TabelaDefinicaoPolos'
import {
  AreaConteudo,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  CartaoListagemDefinicaoPolos,
  ContainerPaginaDefinicoesPolo,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Definição de Polos' },
] as const

export default function PaginaDefinicoesPolo() {
  const navigate = useNavigate()
  const sincronizacaoInicialConcluida = useRef(false)

  const [filtros, setFiltros] = useState<FiltrosListagemDefinicaoPolos>(
    FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  )
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosListagemDefinicaoPolos>(
      FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    )
  const [polos, setPolos] = useState<DefinicaoPolo[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [estaCarregandoListagem, setEstaCarregandoListagem] = useState(true)
  const [mensagemCarregamento, setMensagemCarregamento] = useState(
    'Carregando definição de polos...',
  )
  const [polosSelecionados, setPolosSelecionados] = useState<Set<string>>(
    () => new Set(),
  )
  const [polosParaAlterarEdicao, setPolosParaAlterarEdicao] = useState<
    string[]
  >([])
  const [polosParaAlterarTipoPolo, setPolosParaAlterarTipoPolo] = useState<
    string[]
  >([])
  const [estaSalvandoAlteracao, setEstaSalvandoAlteracao] = useState(false)
  const [mensagemErroAlteracao, setMensagemErroAlteracao] = useState<
    string | null
  >(null)

  const carregarPolos = useCallback(
    async (
      pagina: number,
      tamanhoPagina: number,
      filtrosListagem: FiltrosListagemDefinicaoPolos,
    ) => {
      setEstaCarregandoListagem(true)
      setMensagemCarregamento('Carregando definição de polos...')

      try {
        const listagem = await listarDefinicoesPolo({
          pagina,
          tamanhoPagina,
          ...filtrosListagem,
        })

        setPolos(listagem.polos)
        setPaginaAtual(listagem.pagina)
        setItensPorPagina(listagem.tamanhoPagina)
        setTotalPaginas(listagem.totalPaginas)
      } catch {
        // Em falha na listagem, exibe estado vazio.
        setPolos([])
        setTotalPaginas(0)
      } finally {
        setEstaCarregandoListagem(false)
      }

      if (!sincronizacaoInicialConcluida.current) {
        sincronizacaoInicialConcluida.current = true
        setMensagemCarregamento(
          'Sincronizando unidades novas em segundo plano...',
        )

        try {
          const resultadoSync = await sincronizarUnidadesDiretas()
          if (!resultadoSync.executada || resultadoSync.totalNovos === 0) {
            return
          }

          const listagemAtualizada = await listarDefinicoesPolo({
            pagina,
            tamanhoPagina,
            ...filtrosListagem,
          })
          setPolos(listagemAtualizada.polos)
          setPaginaAtual(listagemAtualizada.pagina)
          setItensPorPagina(listagemAtualizada.tamanhoPagina)
          setTotalPaginas(listagemAtualizada.totalPaginas)
        } catch {
          // Mantém a listagem já carregada do banco.
        }
      }
    },
    [],
  )

  useEffect(() => {
    void carregarPolos(paginaAtual, itensPorPagina, filtrosAplicados)
  }, [carregarPolos, filtrosAplicados, itensPorPagina, paginaAtual])

  const mudarItensPorPagina = useCallback((novoTamanhoPagina: number) => {
    setItensPorPagina(novoTamanhoPagina)
    setPaginaAtual(1)
  }, [])

  const aplicarFiltros = () => {
    setPolosSelecionados(new Set())
    setFiltrosAplicados(filtros)
    setPaginaAtual(1)
  }

  const limparFiltros = () => {
    setPolosSelecionados(new Set())
    setFiltros(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
    setFiltrosAplicados(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
    setPaginaAtual(1)
  }

  const fecharModalAlterarEdicao = () => {
    if (estaSalvandoAlteracao) return
    setMensagemErroAlteracao(null)
    setPolosParaAlterarEdicao([])
  }

  const confirmarAlteracaoEdicao = async (nomeEdicao: string) => {
    if (!nomeEdicao.trim() || polosParaAlterarEdicao.length === 0) return

    setEstaSalvandoAlteracao(true)
    setMensagemErroAlteracao(null)

    try {
      await atualizarDefinicoesPoloEmLote({
        ids: polosParaAlterarEdicao,
        nomeEdicao: nomeEdicao.trim(),
      })
      setPolosSelecionados(new Set())
      setPolosParaAlterarEdicao([])
      await carregarPolos(paginaAtual, itensPorPagina, filtrosAplicados)
    } catch (error_) {
      const mensagem =
        error_ instanceof ErroAtualizacaoDefinicoesPolo
          ? error_.mensagemUsuario
          : 'Não foi possível alterar a edição dos polos selecionados.'
      setMensagemErroAlteracao(mensagem)
    } finally {
      setEstaSalvandoAlteracao(false)
    }
  }

  const abrirModalAlterarEdicao = (idsPolos: string[]) => {
    setMensagemErroAlteracao(null)
    setPolosParaAlterarEdicao(idsPolos)
  }

  const fecharModalAlterarTipoPolo = () => {
    if (estaSalvandoAlteracao) return
    setMensagemErroAlteracao(null)
    setPolosParaAlterarTipoPolo([])
  }

  const confirmarAlteracaoTipoPolo = async (tipoPolo: string) => {
    if (!tipoPolo.trim() || polosParaAlterarTipoPolo.length === 0) return

    setEstaSalvandoAlteracao(true)
    setMensagemErroAlteracao(null)

    try {
      await atualizarDefinicoesPoloEmLote({
        ids: polosParaAlterarTipoPolo,
        tipo: tipoPolo.trim(),
      })
      setPolosSelecionados(new Set())
      setPolosParaAlterarTipoPolo([])
      await carregarPolos(paginaAtual, itensPorPagina, filtrosAplicados)
    } catch (error_) {
      const mensagem =
        error_ instanceof ErroAtualizacaoDefinicoesPolo
          ? error_.mensagemUsuario
          : 'Não foi possível alterar o tipo dos polos selecionados.'
      setMensagemErroAlteracao(mensagem)
    } finally {
      setEstaSalvandoAlteracao(false)
    }
  }

  const abrirModalAlterarTipoPolo = (idsPolos: string[]) => {
    setMensagemErroAlteracao(null)
    setPolosParaAlterarTipoPolo(idsPolos)
  }

  return (
    <ContainerPaginaDefinicoesPolo>
      <MenuLateral />

      <SecaoPrincipal>
        <CabecalhoPagina />

        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />

          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Definição de Polos</h3>

              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar ao início"
                  onClick={() => navigate('/inicio')}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />

                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>

            <FiltrosDefinicaoPolos
              valores={filtros}
              onChange={setFiltros}
              onLimpar={limparFiltros}
              onFiltrar={aplicarFiltros}
            />

            <CartaoListagemDefinicaoPolos>
              {estaCarregandoListagem ? (
                <IndicadorCarregamento mensagem={mensagemCarregamento} />
              ) : (
                <TabelaDefinicaoPolos
                  polos={polos}
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  itensPorPagina={itensPorPagina}
                  polosSelecionados={polosSelecionados}
                  onMudarSelecao={setPolosSelecionados}
                  onMudarPagina={setPaginaAtual}
                  onMudarItensPorPagina={mudarItensPorPagina}
                  onVisualizarPolo={() => undefined}
                  onAlterarEdicaoPolo={abrirModalAlterarEdicao}
                  onAlterarTipoPolo={abrirModalAlterarTipoPolo}
                />
              )}
            </CartaoListagemDefinicaoPolos>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>

      {polosParaAlterarEdicao.length > 0 && (
        <ModalAlterarEdicaoDoPolo
          aberto
          estaSalvando={estaSalvandoAlteracao}
          mensagemErro={mensagemErroAlteracao}
          onFechar={fecharModalAlterarEdicao}
          onAlterar={(nomeEdicao) => {
            void confirmarAlteracaoEdicao(nomeEdicao)
          }}
        />
      )}

      {polosParaAlterarTipoPolo.length > 0 && (
        <ModalAlterarTipoDePolo
          aberto
          estaSalvando={estaSalvandoAlteracao}
          mensagemErro={mensagemErroAlteracao}
          onFechar={fecharModalAlterarTipoPolo}
          onAlterar={(tipoPolo) => {
            void confirmarAlteracaoTipoPolo(tipoPolo)
          }}
        />
      )}
    </ContainerPaginaDefinicoesPolo>
  )
}
