import { useState } from 'react'
import { Link } from 'react-router-dom'
import { iconeLapisEditar } from '@/assets'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { OPCOES_ITENS_POR_PAGINA } from '@/components/Paginacao'
import {
  TabelaListagem,
  type DefinicaoColuna,
} from '@/components/TabelaListagem'
import { Button } from '@/components/ui/button'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { formatarPeriodo } from '@/lib/formatarPeriodo'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'

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
] as const satisfies readonly DefinicaoColuna<EdicaoPrograma>[]

export function EdicaoListagem() {
  const listagemQuery = useGetEdicoesPrograma()
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState<number>(
    OPCOES_ITENS_POR_PAGINA[0],
  )

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  if (listagemQuery.isPending) {
    return (
      <IndicadorCarregamento mensagem="Carregando edições do programa..." />
    )
  }

  if (listagemQuery.isError) {
    return <AlertaErroApi erro={listagemQuery.error} />
  }

  const edicoes = listagemQuery.data ?? []
  const totalPaginas = Math.ceil(edicoes.length / itensPorPagina)
  const paginaAjustada =
    totalPaginas > 0 ? Math.min(paginaAtual, totalPaginas) : 1

  return (
    <TabelaListagem
      itens={edicoes}
      colunas={COLUNAS}
      obterId={(edicao) => edicao.id}
      colunaOrdenacaoInicial="nome"
      paginaAtual={paginaAjustada}
      totalPaginas={totalPaginas}
      itensPorPagina={itensPorPagina}
      onMudarPagina={setPaginaAtual}
      onMudarItensPorPagina={mudarItensPorPagina}
      rotuloAcessivelPaginacao="Paginação da listagem de edições"
      renderizarAcoes={(edicao) => (
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
      )}
    />
  )
}
