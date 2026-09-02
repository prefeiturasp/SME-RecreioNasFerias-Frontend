import { useMemo, useState } from 'react'
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
import { mapearDefinicaoPolo } from '@/services/definicaoPolo/mapearDefinicaoPolo'
import type { DefinicaoPolo } from '@/services/definicaoPolo/types'

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
    id: 'nomeUe',
    rotulo: 'Nome da UE',
    valorOrdenacao: (polo) => polo.nomeUe,
    renderizar: (polo) => polo.nomeUe,
  },
  {
    id: 'nomeEdicao',
    rotulo: 'Nome da Edição',
    valorOrdenacao: (polo) => polo.nomeEdicao,
    renderizar: (polo) => polo.nomeEdicao,
  },
  {
    id: 'tipoPolo',
    rotulo: 'Tipo de Polo',
    valorOrdenacao: (polo) => polo.tipoPolo,
    renderizar: (polo) => polo.tipoPolo,
  },
  {
    id: 'gestao',
    rotulo: 'Gestão',
    valorOrdenacao: (polo) => polo.gestao,
    renderizar: (polo) => polo.gestao,
  },
] as const satisfies readonly DefinicaoColuna<DefinicaoPolo>[]

type DefinicaoPolosListagemProps = {
  onVisualizarPolo?: (idPolo: string) => void
  onAlterarEdicaoPolo: (idsPolos: string[]) => void
  onAlterarTipoPolo: (idsPolos: string[]) => void
}

export function DefinicaoPolosListagem({
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

  const polos = useMemo(
    () => (listagemQuery.data ?? []).map(mapearDefinicaoPolo),
    [listagemQuery.data],
  )
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
      colunaOrdenacaoInicial="nomeUe"
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
        rotuloSelecionarItem: (polo) => `Selecionar polo ${polo.nomeUe}`,
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
            aria-label={`Visualizar polo ${polo.nomeUe}`}
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
            aria-label={`Alterar edição do polo ${polo.nomeUe}`}
            onClick={() => onAlterarEdicaoPolo([polo.id])}
          >
            <ChevronDownIcon />
          </Button>
        </div>
      )}
    />
  )
}
