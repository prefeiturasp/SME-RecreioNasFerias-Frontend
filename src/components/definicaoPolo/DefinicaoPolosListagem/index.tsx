import { useEffect, useState } from 'react'
import { iconeOlho } from '@/assets'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { BarraAcoesSelecao } from '@/components/definicaoPolo/BarraAcoesSelecao'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { ChevronDownIcon } from '@/components/icons'
import { TabelaListagem } from '@/components/TabelaListagem'
import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import { Button } from '@/components/ui/button'
import { OPCOES_ITENS_POR_PAGINA } from '@/constants/paginacao'
import { useGetDefinicoesPolo } from '@/hooks/useGetDefinicoesPolo'
import type {
  DefinicaoPoloApi,
  FiltrosListagemDefinicaoPolos,
} from '@/services/definicaoPolo/types'

const TIPO_POLO_PADRAO = 'Pendente'
const NOME_EDICAO_PADRAO = '-'

function formatarNomeEdicao(nomeEdicao?: string | null) {
  return nomeEdicao?.trim() ? nomeEdicao : NOME_EDICAO_PADRAO
}

function formatarTipoPolo(tipo?: string | null) {
  return tipo?.trim() ? tipo : TIPO_POLO_PADRAO
}

function filtrarDefinicoesPolo(
  polos: DefinicaoPoloApi[],
  filtros: FiltrosListagemDefinicaoPolos,
) {
  return polos.filter((polo) => {
    if (filtros.dre && polo.dre !== filtros.dre) {
      return false
    }

    if (filtros.tipoUe && polo.tipoUe !== filtros.tipoUe) {
      return false
    }

    if (filtros.gestao && polo.gestao !== filtros.gestao) {
      return false
    }

    if (
      filtros.nomeEdicao &&
      formatarNomeEdicao(polo.nomeEdicao) !== filtros.nomeEdicao
    ) {
      return false
    }

    if (filtros.tipoPolo && formatarTipoPolo(polo.tipo) !== filtros.tipoPolo) {
      return false
    }

    if (filtros.nomeUeOuCodigoEol.trim()) {
      const termo = filtros.nomeUeOuCodigoEol.trim().toLowerCase()

      if (!polo.nomePolo.toLowerCase().includes(termo)) {
        return false
      }
    }

    return true
  })
}

const COLUNAS = [
  {
    id: 'dre',
    rotulo: 'DRE',
    valorOrdenacao: (polo) => polo.dre,
    renderizar: (polo) => polo.dre,
  },
  {
    id: 'tipoUe',
    rotulo: 'Tipo de UE',
    valorOrdenacao: (polo) => polo.tipoUe,
    renderizar: (polo) => polo.tipoUe,
  },
  {
    id: 'nomePolo',
    rotulo: 'Nome da UE',
    valorOrdenacao: (polo) => polo.nomePolo,
    renderizar: (polo) => polo.nomePolo,
  },
  {
    id: 'nomeEdicao',
    rotulo: 'Nome da Edição',
    valorOrdenacao: (polo) => formatarNomeEdicao(polo.nomeEdicao),
    renderizar: (polo) => formatarNomeEdicao(polo.nomeEdicao),
  },
  {
    id: 'tipo',
    rotulo: 'Tipo de Polo',
    valorOrdenacao: (polo) => formatarTipoPolo(polo.tipo),
    renderizar: (polo) => formatarTipoPolo(polo.tipo),
  },
  {
    id: 'gestao',
    rotulo: 'Gestão',
    valorOrdenacao: (polo) => polo.gestao,
    renderizar: (polo) => polo.gestao,
  },
] as const satisfies readonly DefinicaoColuna<DefinicaoPoloApi>[]

type DefinicaoPolosListagemProps = {
  filtros?: FiltrosListagemDefinicaoPolos
  chaveResetSelecao?: number
  onVisualizarPolo?: (idPolo: string) => void
  onAlterarEdicaoPolo: (idsPolos: string[]) => void
  onAlterarTipoPolo: (idsPolos: string[]) => void
}

export function DefinicaoPolosListagem({
  filtros,
  chaveResetSelecao = 0,
  onVisualizarPolo,
  onAlterarEdicaoPolo,
  onAlterarTipoPolo,
}: Readonly<DefinicaoPolosListagemProps>) {
  const listagemQuery = useGetDefinicoesPolo()
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )
  const [polosSelecionados, setPolosSelecionados] = useState<Set<string>>(
    () => new Set(),
  )

  const polosFiltrados = filtros
    ? filtrarDefinicoesPolo(listagemQuery.data ?? [], filtros)
    : (listagemQuery.data ?? [])

  useEffect(() => {
    setPaginaAtual(1)
  }, [filtros])

  useEffect(() => {
    setPolosSelecionados(new Set())
  }, [chaveResetSelecao])

  const polos = polosFiltrados
  const totalPaginas = Math.ceil(polos.length / itensPorPagina)
  const paginaAjustada =
    totalPaginas > 0 ? Math.min(paginaAtual, totalPaginas) : 1

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  if (listagemQuery.isPending) {
    return (
      <IndicadorCarregamento mensagem="Carregando definição de polos..." />
    )
  }

  if (listagemQuery.isError) {
    return <AlertaErroApi erro={listagemQuery.error} />
  }

  return (
    <TabelaListagem
      itens={polos}
      colunas={COLUNAS}
      obterId={(polo) => polo.id}
      colunaOrdenacaoInicial="nomePolo"
      titulo="Resultados da pesquisa"
      paginaAtual={paginaAjustada}
      totalPaginas={totalPaginas}
      itensPorPagina={itensPorPagina}
      onMudarPagina={setPaginaAtual}
      onMudarItensPorPagina={mudarItensPorPagina}
      rotuloAcessivelPaginacao="Paginação da listagem de definição de polos"
      selecao={{
        idsSelecionados: polosSelecionados,
        onMudarSelecao: setPolosSelecionados,
        rotuloSelecionarTodos: 'Selecionar todos os polos da página',
        rotuloSelecionarItem: (polo) => `Selecionar polo ${polo.nomePolo}`,
      }}
      renderizarBarraSelecao={({ idsSelecionadosNaPagina, limparSelecao }) => (
        <BarraAcoesSelecao
          quantidadeSelecionada={idsSelecionadosNaPagina.length}
          onAlterarEdicao={() => onAlterarEdicaoPolo(idsSelecionadosNaPagina)}
          onAlterarTipoPolo={() => onAlterarTipoPolo(idsSelecionadosNaPagina)}
          onCancelar={limparSelecao}
        />
      )}
      renderizarAcoes={(polo) => (
        <div className="inline-flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-brand-dark"
            aria-label={`Visualizar polo ${polo.nomePolo}`}
            onClick={() => onVisualizarPolo?.(polo.id)}
          >
            <img
              src={iconeOlho}
              alt=""
              aria-hidden="true"
              className="size-5"
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-brand-dark"
            aria-label={`Alterar edição do polo ${polo.nomePolo}`}
            onClick={() => onAlterarEdicaoPolo([polo.id])}
          >
            <ChevronDownIcon />
          </Button>
        </div>
      )}
    />
  )
}
