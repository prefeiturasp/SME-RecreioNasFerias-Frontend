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
    informacao:
      'A capacidade real é o valor informado pelo Polo com acréscimo de 30%.',
    valorOrdenacao: (historico) => historico.resultado_final_de_inscritos ?? 0,
    renderizar: (historico) => historico.resultado_final_de_inscritos ?? '-',
  },
] as const satisfies readonly DefinicaoColuna<HistoricoListagem>[]

export function HistoricoDefinicaoPolo({
  poloUuid,
}: Readonly<{ poloUuid: string }>) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [desabilitaPaginacao, setDesabilitaPaginacao] = useState(false)

  const listagemQuery = useGetHistoricoDefinicoesPolo({
    polo: poloUuid,
    page: paginaAtual,
    page_size: itensPorPagina,
    desabilita_paginacao: desabilitaPaginacao,
  })

  const resultados = Array.isArray(listagemQuery.data)
    ? listagemQuery.data
    : (listagemQuery.data?.results ?? [])
  const historico: HistoricoListagem[] = resultados.map((item, indice) => ({
    ...item,
    id: `${paginaAtual}-${indice}`,
  }))
  const totalRegistros = Array.isArray(listagemQuery.data)
    ? historico.length
    : (listagemQuery.data?.count ?? 0)
  const totalPaginas = desabilitaPaginacao
    ? 1
    : Math.ceil(totalRegistros / itensPorPagina)

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  return (
    <>
      <h5 className="mt-6 mb-3 text-sm font-bold text-brand-dark">Histórico</h5>

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
        permitirDesabilitarPaginacao
        desabilitaPaginacao={desabilitaPaginacao}
        onMudarDesabilitaPaginacao={(desabilitada) => {
          setDesabilitaPaginacao(desabilitada)
          setPaginaAtual(1)
        }}
        rotuloAcessivelPaginacao="Paginação do histórico da definição do polo"
      />
    </>
  )
}
