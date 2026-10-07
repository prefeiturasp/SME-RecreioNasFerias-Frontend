import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { iconeOlho } from '@/assets'
import { BarraAcoesSelecao } from '@/components/definicaoPolo/BarraAcoesSelecao'
import { IndicadorCargaPolos } from '@/components/definicaoPolo/IndicadorCargaPolos'
import { ChevronDownIcon } from '@/components/icons'
import { TabelaListagem } from '@/components/TabelaListagem'
import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import { Button } from '@/components/ui/button'
import { useGetDefinicoesPolo } from '@/hooks/useGetDefinicoesPolo'
import { useToast } from '@/hooks/useToast'
import {
  type DefinicaoPoloApi,
  type FiltrosListagemDefinicaoPolos,
  type PoloParaAlterarTipo,
} from '@/services/definicaoPolo/types'
import { useDefinicaoPoloStore } from '@/stores/filtroDefinicaoPolosStore'
import { useShallow } from 'zustand/react/shallow'

const TOAST_ERRO_LISTAGEM_ID = 'erro-listagem-definicoes-polos'

type ErroApi = AxiosError<{ detalhe: string }>

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
    renderizar: (polo) => formatarTipoPolo(polo.tipo_polo_edicao_label),
  },
  {
    id: 'gestao',
    rotulo: 'Gestão',
    valorOrdenacao: (polo) => polo.gestao,
    renderizar: (polo) => polo.gestao_label,
  },
] as const satisfies readonly DefinicaoColuna<DefinicaoPoloApi>[]

type DefinicaoPolosListagemProps = {
  filtros?: FiltrosListagemDefinicaoPolos
  chaveResetSelecao?: number
  onVisualizarPolo?: (definicaoUuid: string) => void
  onAlterarEdicaoPolo: (idsPolos: string[]) => void
  onAlterarTipoPolo: (polos: PoloParaAlterarTipo[]) => void
}

export function DefinicaoPolosListagem({
  chaveResetSelecao = 0,
  onVisualizarPolo,
  onAlterarEdicaoPolo,
  onAlterarTipoPolo,
}: Readonly<DefinicaoPolosListagemProps>) {
  const { showToast } = useToast()
  const [polosSelecionados, setPolosSelecionados] = useState<Set<string>>(
    () => new Set(),
  )

  const { paginaAtual, setPaginaAtual, itensPorPagina, setItensPorPagina } =
    useDefinicaoPoloStore(
      useShallow((estado) => ({
        paginaAtual: estado.paginaAtual,
        setPaginaAtual: estado.setPaginaAtual,
        itensPorPagina: estado.itensPorPagina,
        setItensPorPagina: estado.setItensPorPagina,
      })),
    )

  const listagemQuery = useGetDefinicoesPolo()

  const polos = listagemQuery.data?.results ?? []
  const totalRegistros = listagemQuery.data?.count ?? 0

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
    setPaginaAtual,
  ])

  useEffect(() => {
    if (!listagemQuery.isError) return

    showToast({
      id: TOAST_ERRO_LISTAGEM_ID,
      variant: 'destructive',
      title: 'Erro ao carregar definições de polos',
      description: (listagemQuery.error as ErroApi).response?.data.detalhe,
    })
  }, [listagemQuery.error, listagemQuery.isError, showToast])

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  if (listagemQuery.isPending && !listagemQuery.isPlaceholderData) {
    return <IndicadorCargaPolos />
  }

  if (listagemQuery.isError) {
    return null
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
      renderizarAcoes={(polo) => {
        const podeVisualizar = Boolean(polo.definicao_uuid)

        return (
          <div className="inline-flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-brand-dark"
              aria-label={`Visualizar polo ${polo.nome_polo}`}
              disabled={!podeVisualizar}
              onClick={() => {
                if (!polo.definicao_uuid) return
                onVisualizarPolo?.(polo.definicao_uuid)
              }}
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
              aria-label={`Alterar edição do polo ${polo.nome_polo}`}
              onClick={() => onAlterarEdicaoPolo([polo.polo_uuid])}
            >
              <ChevronDownIcon />
            </Button>
          </div>
        )
      }}
    />
  )
}
