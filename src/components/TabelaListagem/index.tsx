import { Paginacao } from '@/components/Paginacao'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  InfoIcon,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import type { DefinicaoColuna } from './types'

type DirecaoOrdenacao = 'asc' | 'desc'
type ModoPaginacao = 'cliente' | 'servidor'

type SelecaoListagem<T> = {
  idsSelecionados: Set<string>
  onMudarSelecao: (ids: Set<string>) => void
  rotuloSelecionarTodos?: string
  rotuloSelecionarItem?: (item: T) => string
}

type ContextoBarraSelecao = {
  idsSelecionadosNaPagina: string[]
  limparSelecao: () => void
}

type TabelaListagemProps<T> = {
  itens: T[]
  colunas: readonly DefinicaoColuna<T>[]
  obterId: (item: T) => string
  colunaOrdenacaoInicial?: string
  modoPaginacao?: ModoPaginacao
  titulo?: string
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
  rotuloAcessivelPaginacao?: string
  rotuloAcoes?: string
  renderizarAcoes?: (item: T) => ReactNode
  selecao?: SelecaoListagem<T>
  renderizarBarraSelecao?: (contexto: ContextoBarraSelecao) => ReactNode
  mensagemVazia?: string
}

function rotuloBotaoOrdenacao(
  rotulo: string,
  colunaAtiva: boolean,
  direcao: DirecaoOrdenacao,
) {
  if (!colunaAtiva) {
    return `Ordenar por ${rotulo}`
  }

  const ordem = direcao === 'asc' ? 'crescente' : 'decrescente'
  return `Ordenar por ${rotulo}, ordem ${ordem}`
}

function ariaSortDaColuna(
  colunaAtiva: boolean,
  direcao: DirecaoOrdenacao,
): 'ascending' | 'descending' | 'none' {
  if (!colunaAtiva) {
    return 'none'
  }

  return direcao === 'asc' ? 'ascending' : 'descending'
}

function compararValoresOrdenacao(
  valorA: string | number,
  valorB: string | number,
  direcao: DirecaoOrdenacao,
) {
  const fator = direcao === 'asc' ? 1 : -1

  if (typeof valorA === 'string' && typeof valorB === 'string') {
    return (
      valorA.localeCompare(valorB, 'pt-BR', { sensitivity: 'base' }) * fator
    )
  }

  if (valorA < valorB) return -1 * fator
  if (valorA > valorB) return 1 * fator
  return 0
}

function IconeDirecaoOrdenacao({
  colunaAtiva,
  direcao,
}: Readonly<{ colunaAtiva: boolean; direcao: DirecaoOrdenacao }>) {
  if (!colunaAtiva) {
    return <ArrowUpDownIcon className="text-placeholder" />
  }

  return direcao === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
}

function calcularEstadoSelecao(
  selecao: Pick<SelecaoListagem<unknown>, 'idsSelecionados'> | undefined,
  idsItensPagina: string[],
) {
  if (!selecao) {
    return {
      idsSelecionadosNaPagina: [] as string[],
      todosSelecionados: false,
      selecaoParcial: false,
    }
  }

  const idsSelecionadosNaPagina = idsItensPagina.filter((id) =>
    selecao.idsSelecionados.has(id),
  )
  const todosSelecionados =
    idsItensPagina.length > 0 &&
    idsItensPagina.every((id) => selecao.idsSelecionados.has(id))
  const selecaoParcial =
    idsItensPagina.some((id) => selecao.idsSelecionados.has(id)) &&
    !todosSelecionados

  return {
    idsSelecionadosNaPagina,
    todosSelecionados,
    selecaoParcial,
  }
}

export function TabelaListagem<T>({
  itens,
  colunas,
  obterId,
  colunaOrdenacaoInicial,
  modoPaginacao = 'cliente',
  titulo,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
  rotuloAcessivelPaginacao,
  rotuloAcoes = 'Ações',
  renderizarAcoes,
  selecao,
  renderizarBarraSelecao,
  mensagemVazia = 'Sem dados',
}: Readonly<TabelaListagemProps<T>>) {
  const [colunaOrdenacao, setColunaOrdenacao] = useState(
    colunaOrdenacaoInicial ?? colunas[0]?.id ?? '',
  )
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>('asc')

  const itensOrdenados = useMemo(() => {
    const definicaoColuna =
      colunas.find((coluna) => coluna.id === colunaOrdenacao) ?? colunas[0]

    if (!definicaoColuna) {
      return itens
    }

    return itens.toSorted((a, b) =>
      compararValoresOrdenacao(
        definicaoColuna.valorOrdenacao(a),
        definicaoColuna.valorOrdenacao(b),
        direcaoOrdenacao,
      ),
    )
  }, [colunaOrdenacao, colunas, direcaoOrdenacao, itens])

  const itensDaPagina = useMemo(() => {
    if (modoPaginacao === 'servidor') {
      return itensOrdenados
    }

    const inicio = (paginaAtual - 1) * itensPorPagina
    return itensOrdenados.slice(inicio, inicio + itensPorPagina)
  }, [itensOrdenados, itensPorPagina, modoPaginacao, paginaAtual])

  const idsItensPagina = itensDaPagina.map(obterId)
  const { idsSelecionadosNaPagina, todosSelecionados, selecaoParcial } =
    calcularEstadoSelecao(selecao, idsItensPagina)
  const possuiSelecaoNaPagina = idsSelecionadosNaPagina.length > 0

  function alternarOrdenacao(coluna: string) {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
    } else {
      setColunaOrdenacao(coluna)
      setDirecaoOrdenacao('asc')
    }

    if (modoPaginacao === 'cliente') {
      onMudarPagina(1)
    }
  }

  function alternarSelecaoItem(idItem: string, selecionado: boolean) {
    if (!selecao) {
      return
    }

    const proximo = new Set(selecao.idsSelecionados)

    if (selecionado) {
      proximo.add(idItem)
    } else {
      proximo.delete(idItem)
    }

    selecao.onMudarSelecao(proximo)
  }

  function alternarSelecaoTodos(selecionado: boolean) {
    if (!selecao) {
      return
    }

    const proximo = new Set(selecao.idsSelecionados)

    if (selecionado) {
      idsItensPagina.forEach((id) => proximo.add(id))
    } else {
      idsItensPagina.forEach((id) => proximo.delete(id))
    }

    selecao.onMudarSelecao(proximo)
  }

  function limparSelecao() {
    selecao?.onMudarSelecao(new Set())
  }

  if (itens.length === 0) {
    return (
      <>
        {titulo ? (
          <p className="mb-4 text-sm font-semibold text-brand-dark">{titulo}</p>
        ) : null}
        <p className="block text-center text-sm">{mensagemVazia}</p>
      </>
    )
  }

  let estadoCheckboxSelecionarTodos: boolean | 'indeterminate'

  if (todosSelecionados) {
    estadoCheckboxSelecionarTodos = true
  } else if (selecaoParcial) {
    estadoCheckboxSelecionarTodos = 'indeterminate'
  } else {
    estadoCheckboxSelecionarTodos = false
  }

  return (
    <>
      {titulo ? (
        <p className="mb-4 text-sm font-semibold text-brand-dark">{titulo}</p>
      ) : null}

      <div className="w-full">
        {possuiSelecaoNaPagina && renderizarBarraSelecao
          ? renderizarBarraSelecao({
              idsSelecionadosNaPagina,
              limparSelecao,
            })
          : null}

        <Table className="min-w-4xl border-collapse bg-background">
          <TableHeader className="bg-muted [&_tr]:border-0">
            <TableRow className="hover:bg-transparent">
              {selecao ? (
                <TableHead
                  scope="col"
                  className="h-auto w-12 min-w-12 max-w-12 border border-border px-0 py-3 text-center"
                >
                  <Checkbox
                    aria-label={
                      selecao.rotuloSelecionarTodos ??
                      'Selecionar todos os itens da página'
                    }
                    className="mx-auto"
                    checked={estadoCheckboxSelecionarTodos}
                    onCheckedChange={(marcado) =>
                      alternarSelecaoTodos(marcado === true)
                    }
                  />
                </TableHead>
              ) : null}

              {colunas.map(({ id, rotulo, informacao }) => {
                const colunaAtiva = colunaOrdenacao === id

                return (
                  <TableHead
                    key={id}
                    scope="col"
                    aria-sort={ariaSortDaColuna(colunaAtiva, direcaoOrdenacao)}
                    className="h-auto border border-border px-4 py-3 font-bold"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'font-bold',
                        colunaAtiva && 'text-brand-dark',
                      )}
                      aria-label={rotuloBotaoOrdenacao(
                        rotulo,
                        colunaAtiva,
                        direcaoOrdenacao,
                      )}
                      onClick={() => alternarOrdenacao(id)}
                    >
                      {rotulo}
                      {informacao ? (
                        <Tooltip>
                          <TooltipTrigger className="px-2">
                            <InfoIcon aria-hidden="true" />
                          </TooltipTrigger>
                          <TooltipContent>{informacao}</TooltipContent>
                        </Tooltip>
                      ) : null}
                      <IconeDirecaoOrdenacao
                        colunaAtiva={colunaAtiva}
                        direcao={direcaoOrdenacao}
                      />
                    </Button>
                  </TableHead>
                )
              })}

              {renderizarAcoes ? (
                <TableHead
                  scope="col"
                  className="h-auto w-24 min-w-24 border border-border px-4 py-3 text-center font-bold"
                >
                  {rotuloAcoes}
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {itensDaPagina.map((item) => {
              const idItem = obterId(item)

              return (
                <TableRow key={idItem} className="border-0">
                  {selecao ? (
                    <TableCell className="w-12 min-w-12 max-w-12 border border-border px-0 py-3 text-center">
                      <Checkbox
                        aria-label={
                          selecao.rotuloSelecionarItem?.(item) ??
                          `Selecionar item ${idItem}`
                        }
                        className="mx-auto"
                        checked={selecao.idsSelecionados.has(idItem)}
                        onCheckedChange={(marcado) =>
                          alternarSelecaoItem(idItem, marcado === true)
                        }
                      />
                    </TableCell>
                  ) : null}

                  {colunas.map((coluna) => (
                    <TableCell
                      key={coluna.id}
                      className="border border-border px-4 py-3"
                    >
                      {coluna.renderizar(item)}
                    </TableCell>
                  ))}

                  {renderizarAcoes ? (
                    <TableCell className="w-24 min-w-24 border border-border px-4 py-3 text-center">
                      {renderizarAcoes(item)}
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 0 ? (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          itensPorPagina={itensPorPagina}
          rotuloAcessivel={rotuloAcessivelPaginacao}
          onMudarPagina={onMudarPagina}
          onMudarItensPorPagina={onMudarItensPorPagina}
        />
      ) : null}
    </>
  )
}
