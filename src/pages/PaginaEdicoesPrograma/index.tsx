import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Botao, BotaoVoltar } from '@/components/shared/botao'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import { CabecalhoSecao } from '@/components/shared/cabecalho-secao'
import { CartaoConteudo } from '@/components/shared/cartao-conteudo'
import {
  AreaConteudo,
  ContainerPagina,
  SecaoPrincipal,
} from '@/components/shared/estrutura-pagina'
import { IndicadorCarregamento } from '@/components/shared/indicador-carregamento'
import { MapaVisual } from '@/components/shared/mapa-visual'
import { MenuLateral } from '@/components/shared/menu-lateral'
import { listarEdicoesPrograma } from '../../services/edicaoPrograma/api'
import type { EdicaoPrograma } from '../../services/edicaoPrograma/types'
import { MensagemSucessoAoCriarNovaEdicaoPrograma } from './MensagemSucessoAoCriarNovaEdicaoPrograma'
import { OPCOES_ITENS_POR_PAGINA } from './constantesPaginacao'
import { TabelaListagemEdicoesPrograma } from './TabelaListagemEdicoesPrograma'
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
  const [estaCarregandoListagem, setEstaCarregandoListagem] = useState(true)

  const fecharMensagemSucesso = useCallback(() => {
    setMensagemSucessoVisivel(false)
  }, [])

  const carregarEdicoes = useCallback(
    (pagina: number, tamanhoPagina: number) => {
      setEstaCarregandoListagem(true)

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
        .finally(() => {
          setEstaCarregandoListagem(false)
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
    <ContainerPagina>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <MensagemSucessoAoCriarNovaEdicaoPrograma
            visivel={mensagemSucessoVisivel}
            onFechar={fecharMensagemSucesso}
          />
          <section>
            <CabecalhoSecao
              titulo="Edições do Programa"
              acoes={
                <>
                  <BotaoVoltar
                    aria-label="Voltar ao início"
                    onClick={() => navigate('/inicio')}
                    icone={
                      <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                    }
                  >
                    Voltar
                  </BotaoVoltar>
                  <Botao
                    variante="primario"
                    tamanho="cadastro"
                    onClick={() => navigate('/cadastrar-nova-edicao-programa')}
                  >
                    Cadastrar Nova Edição do Programa
                  </Botao>
                </>
              }
            />
            <CartaoConteudo>
              {estaCarregandoListagem ? (
                <IndicadorCarregamento mensagem="Carregando edições do programa..." />
              ) : (
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
              )}
            </CartaoConteudo>
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPagina>
  )
}
