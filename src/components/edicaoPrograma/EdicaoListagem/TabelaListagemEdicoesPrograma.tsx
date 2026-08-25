import { iconeLapisEditar } from '@/assets'
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
import { formatarPeriodo } from '@/services/edicaoPrograma/formatarPeriodo'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PaginacaoEdicoesPrograma } from './PaginacaoEdicoesPrograma'

type DirecaoOrdenacao = 'asc' | 'desc'

type DefinicaoColuna = {
  id: string
  rotulo: string
  valorOrdenacao: (edicao: EdicaoPrograma) => string | number
  renderizar: (edicao: EdicaoPrograma) => ReactNode
}

const COLUNAS = [
  {
    id: 'nome',
    rotulo: 'Nome da Edição do Programa',
    valorOrdenacao: (edicao) => edicao.nome,
    renderizar: (edicao) => edicao.nome,
  },
  {
    id: 'periodoEdicao',
    rotulo: 'Período da Edição do Programa',
    valorOrdenacao: (edicao) => edicao.dataInicioEdicao,
    renderizar: (edicao) =>
      formatarPeriodo(edicao.dataInicioEdicao, edicao.dataFimEdicao),
  },
  {
    id: 'periodoInscricoes',
    rotulo: 'Período das Inscrições',
    valorOrdenacao: (edicao) => edicao.dataInicioInscricoes,
    renderizar: (edicao) =>
      formatarPeriodo(edicao.dataInicioInscricoes, edicao.dataFimInscricoes),
  },
  {
    id: 'quantidadeInscritos',
    rotulo: 'Quantidade de Inscritos',
    valorOrdenacao: (edicao) => edicao.quantidadeInscritos,
    renderizar: (edicao) => edicao.quantidadeInscritos,
  },
  {
    id: 'quantidadeAtendimentoEfetivo',
    rotulo: 'Quantidade de Atendimento Efetivo',
    valorOrdenacao: (edicao) => edicao.quantidadeAtendimentoEfetivo,
    renderizar: (edicao) => edicao.quantidadeAtendimentoEfetivo,
  },
] as const satisfies readonly DefinicaoColuna[]

type ColunaOrdenacao = (typeof COLUNAS)[number]['id']

type TabelaListagemEdicoesProgramaProps = {
  edicoes: EdicaoPrograma[]
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
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

export function TabelaListagemEdicoesPrograma({
  edicoes,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
}: Readonly<TabelaListagemEdicoesProgramaProps>) {
  const [colunaOrdenacao, setColunaOrdenacao] =
    useState<ColunaOrdenacao>('nome')
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>('asc')

  const edicoesOrdenadas = useMemo(() => {
    const definicaoColuna =
      COLUNAS.find((coluna) => coluna.id === colunaOrdenacao) ?? COLUNAS[0]

    return edicoes.toSorted((a, b) =>
      compararValoresOrdenacao(
        definicaoColuna.valorOrdenacao(a),
        definicaoColuna.valorOrdenacao(b),
        direcaoOrdenacao,
      ),
    )
  }, [colunaOrdenacao, direcaoOrdenacao, edicoes])

  const inicio = (paginaAtual - 1) * itensPorPagina
  const edicoesDaPagina = edicoesOrdenadas.slice(
    inicio,
    inicio + itensPorPagina,
  )

  function alternarOrdenacao(coluna: ColunaOrdenacao) {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
    } else {
      setColunaOrdenacao(coluna)
      setDirecaoOrdenacao('asc')
    }

    onMudarPagina(1)
  }

  const listagemVazia = edicoes.length === 0

  if (listagemVazia) {
    return (
      <output className="block text-center text-sm text-foreground">
        Sem dados
      </output>
    )
  }

  return (
    <>
      <Table className="min-w-4xl border-collapse bg-background">
        <TableHeader className="bg-muted [&_tr]:border-0 [&_th]:h-auto [&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:font-bold [&_th]:text-foreground">
          <TableRow className="hover:bg-transparent">
            {COLUNAS.map(({ id, rotulo }) => {
              const colunaAtiva = colunaOrdenacao === id

              return (
                <TableHead
                  key={id}
                  scope="col"
                  aria-sort={ariaSortDaColuna(colunaAtiva, direcaoOrdenacao)}
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
            <TableHead scope="col">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:text-foreground">
          {edicoesDaPagina.map((edicao) => (
            <TableRow key={edicao.id}>
              {COLUNAS.map((coluna) => (
                <TableCell key={coluna.id}>
                  {coluna.renderizar(edicao)}
                </TableCell>
              ))}
              <TableCell className="text-center">
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  className="text-brand-dark"
                >
                  <Link
                    to={`/editar-edicao-programa/${edicao.id}`}
                    aria-label={`Editar edição ${edicao.nome}`}
                  >
                    <img
                      src={iconeLapisEditar}
                      alt=""
                      aria-hidden="true"
                      className="size-5"
                    />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginacaoEdicoesPrograma
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        itensPorPagina={itensPorPagina}
        onMudarPagina={onMudarPagina}
        onMudarItensPorPagina={onMudarItensPorPagina}
      />
    </>
  )
}
