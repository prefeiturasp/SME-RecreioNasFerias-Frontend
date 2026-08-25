import { iconeLapisEditar } from '@/assets'
import { IconeOrdenacaoTabela } from '@/components/icons'
import {
  BotaoAcaoListagem,
  BotaoOrdenarColuna,
  GrupoAcoesListagem,
  MensagemListagemVazia,
  TituloListagem,
} from '@/components/ListagemTabela/style'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatarPeriodo } from '@/services/edicaoPrograma/formatarPeriodo'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'
import { useMemo, useState } from 'react'
import { PaginacaoEdicoesPrograma } from './PaginacaoEdicoesPrograma'

type ColunaOrdenacao =
  | 'nome'
  | 'periodoEdicao'
  | 'periodoInscricoes'
  | 'quantidadeInscritos'
  | 'quantidadeAtendimentoEfetivo'

type DirecaoOrdenacao = 'asc' | 'desc'

type TabelaListagemEdicoesProgramaProps = {
  edicoes: EdicaoPrograma[]
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
  onEditarEdicao: (idEdicao: string) => void
}

const COLUNAS_ORDENAVEIS: { id: ColunaOrdenacao; rotulo: string }[] = [
  { id: 'nome', rotulo: 'Nome da Edição do Programa' },
  { id: 'periodoEdicao', rotulo: 'Período da Edição do Programa' },
  { id: 'periodoInscricoes', rotulo: 'Período das Inscrições' },
  { id: 'quantidadeInscritos', rotulo: 'Quantidade de Inscritos' },
  {
    id: 'quantidadeAtendimentoEfetivo',
    rotulo: 'Quantidade de Atendimento Efetivo',
  },
]

function obterValorOrdenacao(
  edicao: EdicaoPrograma,
  coluna: ColunaOrdenacao,
): string | number {
  switch (coluna) {
    case 'nome':
      return edicao.nome.toLowerCase()
    case 'periodoEdicao':
      return edicao.dataInicioEdicao
    case 'periodoInscricoes':
      return edicao.dataInicioInscricoes
    case 'quantidadeInscritos':
      return edicao.quantidadeInscritos
    case 'quantidadeAtendimentoEfetivo':
      return edicao.quantidadeAtendimentoEfetivo
  }
}

export function TabelaListagemEdicoesPrograma({
  edicoes,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
  onEditarEdicao,
}: Readonly<TabelaListagemEdicoesProgramaProps>) {
  const [colunaOrdenacao, setColunaOrdenacao] =
    useState<ColunaOrdenacao>('nome')
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>('asc')

  const edicoesOrdenadas = useMemo(() => {
    const copia = [...edicoes]

    copia.sort((a, b) => {
      const valorA = obterValorOrdenacao(a, colunaOrdenacao)
      const valorB = obterValorOrdenacao(b, colunaOrdenacao)

      if (valorA < valorB) return direcaoOrdenacao === 'asc' ? -1 : 1
      if (valorA > valorB) return direcaoOrdenacao === 'asc' ? 1 : -1
      return 0
    })

    return copia
  }, [colunaOrdenacao, direcaoOrdenacao, edicoes])

  const inicio = (paginaAtual - 1) * itensPorPagina
  const edicoesDaPagina = edicoesOrdenadas.slice(
    inicio,
    inicio + itensPorPagina,
  )

  function alternarOrdenacao(coluna: ColunaOrdenacao) {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
      return
    }

    setColunaOrdenacao(coluna)
    setDirecaoOrdenacao('asc')
  }

  if (edicoes.length === 0) {
    return (
      <>
        <TituloListagem>Edições do programa</TituloListagem>
        <MensagemListagemVazia>Sem dados</MensagemListagemVazia>
      </>
    )
  }

  return (
    <>
      <TituloListagem>Edições do programa</TituloListagem>
      <Table className="min-w-4xl border-collapse bg-background">
        <TableHeader className="bg-[#f1f3f5] [&_tr]:border-0 [&_th]:h-auto [&_th]:border [&_th]:border-[#e1e1e1] [&_th]:px-4 [&_th]:py-3 [&_th]:font-bold [&_th]:text-foreground">
          <TableRow className="hover:bg-transparent">
            {COLUNAS_ORDENAVEIS.map(({ id, rotulo }) => (
              <TableHead key={id} scope="col">
                <BotaoOrdenarColuna
                  type="button"
                  aria-label={`Ordenar por ${rotulo}`}
                  onClick={() => alternarOrdenacao(id)}
                >
                  {rotulo}
                  <IconeOrdenacaoTabela />
                </BotaoOrdenarColuna>
              </TableHead>
            ))}
            <TableHead scope="col">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_td]:border [&_td]:border-[#e1e1e1] [&_td]:px-4 [&_td]:py-3 [&_td]:text-foreground">
          {edicoesDaPagina.map((edicao) => (
            <TableRow key={edicao.id}>
              <TableCell>{edicao.nome}</TableCell>
              <TableCell>
                {formatarPeriodo(edicao.dataInicioEdicao, edicao.dataFimEdicao)}
              </TableCell>
              <TableCell>
                {formatarPeriodo(
                  edicao.dataInicioInscricoes,
                  edicao.dataFimInscricoes,
                )}
              </TableCell>
              <TableCell>{edicao.quantidadeInscritos}</TableCell>
              <TableCell>{edicao.quantidadeAtendimentoEfetivo}</TableCell>
              <TableCell className="text-center">
                <GrupoAcoesListagem>
                  <BotaoAcaoListagem
                    type="button"
                    aria-label={`Editar edição ${edicao.nome}`}
                    onClick={() => onEditarEdicao(edicao.id)}
                  >
                    <img src={iconeLapisEditar} alt="" aria-hidden="true" />
                  </BotaoAcaoListagem>
                </GrupoAcoesListagem>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPaginas > 0 && (
        <PaginacaoEdicoesPrograma
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          itensPorPagina={itensPorPagina}
          onMudarPagina={onMudarPagina}
          onMudarItensPorPagina={onMudarItensPorPagina}
        />
      )}
    </>
  )
}
