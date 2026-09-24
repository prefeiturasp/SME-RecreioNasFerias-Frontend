import { TabelaListagem } from '@/components/TabelaListagem'
import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import { useState } from 'react'
import useGetHistoricoDefinicoesPolo from '@/hooks/useGetHistoricoDefinicoesPolo'
import type { Historico } from '@/services/definicaoPolo/types'

type HistoricoListagem = Historico & { id: string }

const COLUNAS = [
  {
    id: 'nome_edicao',
    rotulo: 'Participou da Edição do programa',
    valorOrdenacao: (historico) => historico.edicao.nome,
    renderizar: (historico) => historico.edicao.nome,
  },
  {
    id: 'tipo_polo',
    rotulo: 'Tipo de Polo',
    valorOrdenacao: (historico) => historico.tipo ?? '',
    renderizar: (historico) => historico.tipo,
  },
  {
    id: 'projecao_inscritos',
    rotulo: 'Projeção de inscritos',
    valorOrdenacao: (historico) => historico.projecao_inscritos ?? 0,
    renderizar: (historico) => historico.projecao_inscritos ?? '-',
  },
  {
    id: 'resultado_final_de_inscritos',
    rotulo: 'Resultado final de inscritos',
    valorOrdenacao: (historico) => historico.resultado_final_de_inscritos ?? 0,
    renderizar: (historico) => historico.resultado_final_de_inscritos ?? '-',
  },
] as const satisfies readonly DefinicaoColuna<HistoricoListagem>[]

export function HistoricoDefinicaoPolo({
  poloUuid,
}: Readonly<{ poloUuid: string }>) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const listagemQuery = useGetHistoricoDefinicoesPolo({
    polo: poloUuid,
    page: paginaAtual,
    page_size: itensPorPagina,
  })

  const historico: HistoricoListagem[] = (
    listagemQuery.data?.results ?? []
  ).map((item, indice) => ({
    ...item,
    id: `${paginaAtual}-${indice}`,
  }))
  const totalRegistros = listagemQuery.data?.count ?? 0
  const totalPaginas = Math.ceil(totalRegistros / itensPorPagina)

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  return (
    <>
      <h4 id="secao-historico" className="font-bold text-primary">
        Histórico
      </h4>

      <TabelaListagem
        itens={historico}
        colunas={COLUNAS}
        obterId={(item) => item.id}
        colunaOrdenacaoInicial="nome_edicao"
        modoPaginacao="servidor"
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        itensPorPagina={itensPorPagina}
        onMudarPagina={setPaginaAtual}
        onMudarItensPorPagina={mudarItensPorPagina}
        rotuloAcessivelPaginacao="Paginação do histórico da definição do polo"
      />
    </>
  )
}
