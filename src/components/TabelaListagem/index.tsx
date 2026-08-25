import { Paginacao } from '@/components/Paginacao'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'

type DirecaoOrdenacao = 'asc' | 'desc'

export type DefinicaoColuna<T> = {
  id: string
  rotulo: string
  valorOrdenacao: (item: T) => string | number
  renderizar: (item: T) => ReactNode
}

type TabelaListagemProps<T> = {
  itens: T[]
  colunas: readonly DefinicaoColuna<T>[]
  obterId: (item: T) => string
  colunaOrdenacaoInicial?: string
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
  rotuloAcessivelPaginacao?: string
  rotuloAcoes?: string
  renderizarAcoes?: (item: T) => ReactNode
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

export function TabelaListagem<T>({
  itens,
  colunas,
  obterId,
  colunaOrdenacaoInicial,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
  rotuloAcessivelPaginacao,
  rotuloAcoes = 'Ações',
  renderizarAcoes,
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

  const inicio = (paginaAtual - 1) * itensPorPagina
  const itensDaPagina = itensOrdenados.slice(inicio, inicio + itensPorPagina)

  function alternarOrdenacao(coluna: string) {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
    } else {
      setColunaOrdenacao(coluna)
      setDirecaoOrdenacao('asc')
    }

    onMudarPagina(1)
  }

  if (itens.length === 0) {
    return (
      <output className="block text-center text-sm">{mensagemVazia}</output>
    )
  }

  return (
    <>
      <Table className="min-w-4xl border-collapse">
        <TableHeader className="bg-muted [&_tr]:border-0">
          <TableRow className="hover:bg-transparent">
            {colunas.map(({ id, rotulo }) => {
              const colunaAtiva = colunaOrdenacao === id

              return (
                <TableHead
                  key={id}
                  scope="col"
                  aria-sort={ariaSortDaColuna(colunaAtiva, direcaoOrdenacao)}
                  className="h-auto border px-4 py-3 font-bold"
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
                    <IconeDirecaoOrdenacao
                      colunaAtiva={colunaAtiva}
                      direcao={direcaoOrdenacao}
                    />
                  </Button>
                </TableHead>
              )
            })}
            {renderizarAcoes ? (
              <TableHead scope="col" className="h-auto border px-4 py-3 font-bold">
                {rotuloAcoes}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {itensDaPagina.map((item) => (
            <TableRow key={obterId(item)} className="border-0">
              {colunas.map((coluna) => (
                <TableCell key={coluna.id} className="border px-4 py-3">
                  {coluna.renderizar(item)}
                </TableCell>
              ))}
              {renderizarAcoes ? (
                <TableCell className="border px-4 py-3 text-center">
                  {renderizarAcoes(item)}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        itensPorPagina={itensPorPagina}
        rotuloAcessivel={rotuloAcessivelPaginacao}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={onMudarItensPorPagina}
      />
    </>
  )
}
