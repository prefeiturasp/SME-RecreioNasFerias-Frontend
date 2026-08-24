import { useMemo, useState } from 'react'

import { iconeLapisEditar } from '@/assets'
import { IconeOrdenacaoTabela } from '@/components/icons'
import { PaginacaoListagem } from '@/components/ListagemTabela/PaginacaoListagem'
import {
  BotaoAcaoListagem as BotaoAcaoEdicao,
  BotaoOrdenarColuna,
  CabecalhoTabelaListagem as CabecalhoTabelaEdicoes,
  CelulaAcoesListagem as CelulaAcoesEdicao,
  ContainerTabelaListagem as ContainerTabelaEdicoes,
  CorpoTabelaListagem as CorpoTabelaEdicoes,
  GrupoAcoesListagem as GrupoAcoesEdicao,
  MensagemListagemVazia,
  TabelaListagem as TabelaEdicoes,
  TituloListagem as TituloListagemEdicoes,
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

  const alternarOrdenacao = (coluna: ColunaOrdenacao) => {
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
        <TituloListagemEdicoes>Edições do programa</TituloListagemEdicoes>

        <MensagemListagemVazia>Sem dados</MensagemListagemVazia>
      </>
    )
  }

  return (
    <>
      <TituloListagemEdicoes>Edições do programa</TituloListagemEdicoes>

      <ContainerTabelaEdicoes>
        <TabelaEdicoes>
          <CabecalhoTabelaEdicoes>
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
          </CabecalhoTabelaEdicoes>

          <CorpoTabelaEdicoes>
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

                <CelulaAcoesEdicao>
                  <GrupoAcoesEdicao>
                    <BotaoAcaoEdicao
                      type="button"
                      aria-label={`Editar edição ${edicao.nome}`}
                      onClick={() => onEditarEdicao(edicao.id)}
                    >
                      <img src={iconeLapisEditar} alt="" aria-hidden="true" />
                    </BotaoAcaoEdicao>
                  </GrupoAcoesEdicao>
                </CelulaAcoesEdicao>
              </tr>
            ))}
          </CorpoTabelaEdicoes>
        </TabelaEdicoes>
      </ContainerTabelaEdicoes>

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
