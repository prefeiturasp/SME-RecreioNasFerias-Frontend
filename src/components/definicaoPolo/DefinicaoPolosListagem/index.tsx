import { useEffect, useState } from 'react'
import { iconeOlho } from '@/assets'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { BarraAcoesSelecao } from '@/components/definicaoPolo/BarraAcoesSelecao'
import { IndicadorCargaPolos } from '@/components/definicaoPolo/IndicadorCargaPolos'
import { ChevronDownIcon } from '@/components/icons'
import { TabelaListagem } from '@/components/TabelaListagem'
import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import { Button } from '@/components/ui/button'
import { OPCOES_ITENS_POR_PAGINA } from '@/constants/paginacao'
import { useGetDefinicoesPolo } from '@/hooks/useGetDefinicoesPolo'
import {
  FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  type DefinicaoPoloApi,
  type FiltrosListagemDefinicaoPolos,
  type PoloParaAlterarTipo,
} from '@/services/definicaoPolo/types'

function obterPolosParaAlterarTipo(
  polos: DefinicaoPoloApi[],
  idsPolos: string[],
): PoloParaAlterarTipo[] {
  return polos.flatMap((polo) => {
    if (!idsPolos.includes(polo.polo_uuid)) {
      return []
    }

    return [
      {
        polo_uuid: polo.polo_uuid,
        edicao_uuid: polo.edicao_uuid,
      },
    ]
  })
}

const TIPO_POLO_PADRAO = 'Pendente'
const NOME_EDICAO_PADRAO = '-'

function formatarNomeEdicao(nomeEdicao?: string | null) {
  return nomeEdicao?.trim() ? nomeEdicao : NOME_EDICAO_PADRAO
}

function formatarTipoPolo(tipo?: string | null) {
  return tipo?.trim() ? tipo : TIPO_POLO_PADRAO
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
  onAlterarTipoPolo: (polos: PoloParaAlterarTipo[]) => void
}

export function DefinicaoPolosListagem({
  filtros = FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  chaveResetSelecao = 0,
  onVisualizarPolo,
  onAlterarEdicaoPolo,
  onAlterarTipoPolo,
}: Readonly<DefinicaoPolosListagemProps>) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )
  const [polosSelecionados, setPolosSelecionados] = useState<Set<string>>(
    () => new Set(),
  )

  const listagemQuery = useGetDefinicoesPolo({
    busca: filtros.nomeUeOuCodigoEol,
    dre_codigos_eol: filtros.dre,
    tipo_ue: filtros.tipoUe,
    edicao: filtros.edicao,
    gestao: filtros.gestao,
    tipo_polo: filtros.tipoPolo,
    page: paginaAtual,
    page_size: itensPorPagina,
  })

  const polos = listagemQuery.data?.results ?? []
  const totalRegistros = listagemQuery.data?.count ?? 0

  useEffect(() => {
    setPaginaAtual(1)
  }, [filtros])

  useEffect(() => {
    setPolosSelecionados(new Set())
  }, [chaveResetSelecao])

  const totalPaginas = Math.ceil(totalRegistros / itensPorPagina)

  useEffect(() => {
    if (!listagemQuery.isSuccess || listagemQuery.isPlaceholderData) {
      return
    }

    if (totalPaginas > 0 && paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas)
    }
  }, [
    listagemQuery.isPlaceholderData,
    listagemQuery.isSuccess,
    paginaAtual,
    totalPaginas,
  ])

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  if (listagemQuery.isPending && !listagemQuery.isPlaceholderData) {
    return <IndicadorCargaPolos />
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
      modoPaginacao="servidor"
      titulo="Resultados da pesquisa"
      paginaAtual={paginaAtual}
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
          onAlterarTipoPolo={() =>
            onAlterarTipoPolo(
              obterPolosParaAlterarTipo(polos, idsSelecionadosNaPagina),
            )
          }
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
