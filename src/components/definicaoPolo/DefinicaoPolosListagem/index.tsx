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
    if (filtros.dre && polo.dre_nome !== filtros.dre) {
      return false
    }

    if (filtros.tipoUe && polo.tipo_ue !== filtros.tipoUe) {
      return false
    }

    if (filtros.gestao && polo.gestao !== filtros.gestao) {
      return false
    }

    if (
      filtros.nomeEdicao &&
      formatarNomeEdicao(polo.nome_edicao) !== filtros.nomeEdicao
    ) {
      return false
    }

    if (
      filtros.tipoPolo &&
      formatarTipoPolo(polo.tipo_polo_edicao) !== filtros.tipoPolo
    ) {
      return false
    }

    if (filtros.nomeUeOuCodigoEol.trim()) {
      const termo = filtros.nomeUeOuCodigoEol.trim().toLowerCase()

      if (!polo.nome_polo.toLowerCase().includes(termo)) {
        return false
      }
    }

    return true
  })
}

const COLUNAS = [
  {
    id: 'dre_nome',
    rotulo: 'DRE',
    valorOrdenacao: (polo) => polo.dre_nome,
    renderizar: (polo) => polo.dre_nome,
  },
  {
    id: 'tipo_ue',
    rotulo: 'Tipo de UE',
    valorOrdenacao: (polo) => polo.tipo_ue,
    renderizar: (polo) => polo.tipo_ue,
  },
  {
    id: 'nome_polo',
    rotulo: 'Nome da UE',
    valorOrdenacao: (polo) => polo.nome_polo,
    renderizar: (polo) => polo.nome_polo,
  },
  {
    id: 'nome_edicao',
    rotulo: 'Nome da Edição',
    valorOrdenacao: (polo) => formatarNomeEdicao(polo.nome_edicao),
    renderizar: (polo) => formatarNomeEdicao(polo.nome_edicao),
  },
  {
    id: 'tipo_polo_edicao',
    rotulo: 'Tipo de Polo',
    valorOrdenacao: (polo) => formatarTipoPolo(polo.tipo_polo_edicao),
    renderizar: (polo) => formatarTipoPolo(polo.tipo_polo_edicao),
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
    return <IndicadorCarregamento mensagem="Carregando definição de polos..." />
  }

  if (listagemQuery.isError) {
    return <AlertaErroApi erro={listagemQuery.error} />
  }

  return (
    <TabelaListagem
      itens={polos}
      colunas={COLUNAS}
      obterId={(polo) => polo.polo_uuid}
      colunaOrdenacaoInicial="nome_polo"
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
        rotuloSelecionarItem: (polo) => `Selecionar polo ${polo.nome_polo}`,
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
            aria-label={`Visualizar polo ${polo.nome_polo}`}
            onClick={() => onVisualizarPolo?.(polo.polo_uuid)}
          >
            <img src={iconeOlho} alt="" aria-hidden="true" className="size-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-brand-dark"
            aria-label={`Alterar edição do polo ${polo.nome_polo}`}
            onClick={() => onAlterarEdicaoPolo([polo.polo_uuid])}
          >
            <ChevronDownIcon />
          </Button>
        </div>
      )}
    />
  )
}
