import { useMemo, useState } from 'react'
import { iconeLapisEditar } from '@/assets'
import { IconeOrdenacaoTabela } from '@/components/icons'
import { PaginacaoListagem } from '@/components/ListagemTabela/PaginacaoListagem'
import {
  BotaoAcaoListagem,
  BotaoOrdenarColuna,
  CabecalhoTabelaListagem,
  CelulaAcoesListagem,
  ContainerTabelaListagem,
  CorpoTabelaListagem,
  GrupoAcoesListagem,
  MensagemListagemVazia,
  TabelaListagem,
  TituloListagem,
} from '@/components/ListagemTabela/style'
import { formatarPeriodo } from '@/services/edicaoPrograma/formatarPeriodo'
import type { EdicaoPrograma } from '@/services/edicaoPrograma/types'

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
      <ContainerTabelaListagem>
        <TabelaListagem>
          <CabecalhoTabelaListagem>
            <tr>
              {COLUNAS_ORDENAVEIS.map(({ id, rotulo }) => (
                <th key={id} scope="col">
                  <BotaoOrdenarColuna
                    type="button"
                    aria-label={`Ordenar por ${rotulo}`}
                    onClick={() => alternarOrdenacao(id)}
                  >
                    {rotulo}
                    <IconeOrdenacaoTabela />
                  </BotaoOrdenarColuna>
                </th>
              ))}
              <th scope="col">Ações</th>
            </tr>
          </CabecalhoTabelaListagem>
          <CorpoTabelaListagem>
            {edicoesOrdenadas.map((edicao) => (
              <tr key={edicao.id}>
                <td>{edicao.nome}</td>
                <td>
                  {formatarPeriodo(
                    edicao.dataInicioEdicao,
                    edicao.dataFimEdicao,
                  )}
                </td>
                <td>
                  {formatarPeriodo(
                    edicao.dataInicioInscricoes,
                    edicao.dataFimInscricoes,
                  )}
                </td>
                <td>{edicao.quantidadeInscritos}</td>
                <td>{edicao.quantidadeAtendimentoEfetivo}</td>
                <CelulaAcoesListagem>
                  <GrupoAcoesListagem>
                    <BotaoAcaoListagem
                      type="button"
                      aria-label={`Editar edição ${edicao.nome}`}
                      onClick={() => onEditarEdicao(edicao.id)}
                    >
                      <img src={iconeLapisEditar} alt="" aria-hidden="true" />
                    </BotaoAcaoListagem>
                  </GrupoAcoesListagem>
                </CelulaAcoesListagem>
              </tr>
            ))}
          </CorpoTabelaListagem>
        </TabelaListagem>
      </ContainerTabelaListagem>
      {totalPaginas > 0 && (
        <PaginacaoListagem
          rotuloAcessivel="Paginação da listagem de edições"
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
