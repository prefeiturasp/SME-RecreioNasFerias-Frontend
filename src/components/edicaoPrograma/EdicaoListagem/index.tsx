import { useState } from 'react'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { OPCOES_ITENS_POR_PAGINA } from '@/components/Paginacao'
import { TabelaListagemEdicoesPrograma } from '../TabelaListagemEdicoesPrograma'

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
    <TabelaListagemEdicoesPrograma
      edicoes={edicoes}
      paginaAtual={paginaAjustada}
      totalPaginas={totalPaginas}
      itensPorPagina={itensPorPagina}
      onMudarPagina={setPaginaAtual}
      onMudarItensPorPagina={mudarItensPorPagina}
    />
  )
}
