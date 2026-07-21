import { useMemo, useState } from 'react'

import { iconeOlho } from '../../assets'
import { PaginacaoListagem } from '../../components/ListagemTabela/PaginacaoListagem'
import {
  BotaoAcaoListagem,
  BotaoOrdenarColuna,
  CabecalhoCheckboxListagem,
  CabecalhoTabelaListagem,
  CelulaAcoesListagem,
  CelulaCheckboxListagem,
  CheckboxListagem,
  ContainerTabelaListagem,
  CorpoTabelaListagem,
  GrupoAcoesListagem,
  MensagemListagemVazia,
  TabelaListagem,
  TituloListagem,
} from '../../components/ListagemTabela/style'
import { ChevronDownIcon, IconeOrdenacaoTabela } from '../../components/icons'
import type { DefinicaoPolo } from '../../services/definicaoPolo/types'

import { BarraAcoesSelecaoDefinicaoPolos } from './BarraAcoesSelecaoDefinicaoPolos'

type ColunaOrdenacao =
  | 'dre'
  | 'tipoUe'
  | 'nomeUe'
  | 'nomeEdicao'
  | 'tipoPolo'
  | 'gestao'

type DirecaoOrdenacao = 'asc' | 'desc'

type TabelaDefinicaoPolosProps = {
  polos: DefinicaoPolo[]
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  polosSelecionados: Set<string>
  onMudarSelecao: (selecionados: Set<string>) => void
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
  onVisualizarPolo: (idPolo: string) => void
  onAlterarEdicaoPolo: (idsPolos: string[]) => void
  onAlterarTipoPolo: (idsPolos: string[]) => void
}

const COLUNAS_ORDENAVEIS: { id: ColunaOrdenacao; rotulo: string }[] = [
  { id: 'dre', rotulo: 'DRE' },
  { id: 'tipoUe', rotulo: 'Tipo de UE' },
  { id: 'nomeUe', rotulo: 'Nome da UE' },
  { id: 'nomeEdicao', rotulo: 'Nome da Edição' },
  { id: 'tipoPolo', rotulo: 'Tipo de Polo' },
  { id: 'gestao', rotulo: 'Gestão' },
]

function obterValorOrdenacao(
  polo: DefinicaoPolo,
  coluna: ColunaOrdenacao,
): string {
  return polo[coluna].toLowerCase()
}

export function TabelaDefinicaoPolos({
  polos,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  polosSelecionados,
  onMudarSelecao,
  onMudarPagina,
  onMudarItensPorPagina,
  onVisualizarPolo,
  onAlterarEdicaoPolo,
  onAlterarTipoPolo,
}: Readonly<TabelaDefinicaoPolosProps>) {
  const [colunaOrdenacao, setColunaOrdenacao] =
    useState<ColunaOrdenacao>('nomeUe')
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>('asc')

  const polosOrdenados = useMemo(() => {
    const copia = [...polos]

    copia.sort((a, b) => {
      const valorA = obterValorOrdenacao(a, colunaOrdenacao)
      const valorB = obterValorOrdenacao(b, colunaOrdenacao)

      if (valorA < valorB) return direcaoOrdenacao === 'asc' ? -1 : 1
      if (valorA > valorB) return direcaoOrdenacao === 'asc' ? 1 : -1
      return 0
    })

    return copia
  }, [colunaOrdenacao, direcaoOrdenacao, polos])

  const idsPolosPagina = polosOrdenados.map((polo) => polo.id)
  const idsSelecionadosNaPagina = idsPolosPagina.filter((id) =>
    polosSelecionados.has(id),
  )
  const todosSelecionados =
    idsPolosPagina.length > 0 &&
    idsPolosPagina.every((id) => polosSelecionados.has(id))
  const selecaoParcial =
    idsPolosPagina.some((id) => polosSelecionados.has(id)) && !todosSelecionados
  const possuiSelecaoNaPagina = idsSelecionadosNaPagina.length > 0

  const alternarOrdenacao = (coluna: ColunaOrdenacao) => {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
      return
    }

    setColunaOrdenacao(coluna)
    setDirecaoOrdenacao('asc')
  }

  const alternarSelecaoPolo = (idPolo: string, selecionado: boolean) => {
    const proximo = new Set(polosSelecionados)

    if (selecionado) {
      proximo.add(idPolo)
    } else {
      proximo.delete(idPolo)
    }

    onMudarSelecao(proximo)
  }

  const alternarSelecaoTodos = (selecionado: boolean) => {
    const proximo = new Set(polosSelecionados)

    if (selecionado) {
      idsPolosPagina.forEach((id) => proximo.add(id))
    } else {
      idsPolosPagina.forEach((id) => proximo.delete(id))
    }

    onMudarSelecao(proximo)
  }

  const limparSelecao = () => {
    onMudarSelecao(new Set())
  }

  const alterarEdicaoSelecionados = () => {
    onAlterarEdicaoPolo(idsSelecionadosNaPagina)
  }

  const alterarTipoPoloSelecionados = () => {
    onAlterarTipoPolo(idsSelecionadosNaPagina)
  }

  if (polos.length === 0) {
    return (
      <>
        <TituloListagem>Resultados da pesquisa</TituloListagem>
        <MensagemListagemVazia>Sem dados</MensagemListagemVazia>
      </>
    )
  }

  return (
    <>
      <TituloListagem>Resultados da pesquisa</TituloListagem>

      <ContainerTabelaListagem>
        {possuiSelecaoNaPagina && (
          <BarraAcoesSelecaoDefinicaoPolos
            quantidadeSelecionada={idsSelecionadosNaPagina.length}
            onAlterarEdicao={alterarEdicaoSelecionados}
            onAlterarTipoPolo={alterarTipoPoloSelecionados}
            onCancelar={limparSelecao}
          />
        )}

        <TabelaListagem>
          <CabecalhoTabelaListagem>
            <tr>
              <CabecalhoCheckboxListagem scope="col">
                <CheckboxListagem
                  aria-label="Selecionar todos os polos da página"
                  checked={todosSelecionados}
                  ref={(elemento) => {
                    if (elemento) {
                      elemento.indeterminate = selecaoParcial
                    }
                  }}
                  onChange={(evento) =>
                    alternarSelecaoTodos(evento.target.checked)
                  }
                />
              </CabecalhoCheckboxListagem>

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
            {polosOrdenados.map((polo) => (
              <tr key={polo.id}>
                <CelulaCheckboxListagem>
                  <CheckboxListagem
                    aria-label={`Selecionar polo ${polo.nomeUe}`}
                    checked={polosSelecionados.has(polo.id)}
                    onChange={(evento) =>
                      alternarSelecaoPolo(polo.id, evento.target.checked)
                    }
                  />
                </CelulaCheckboxListagem>

                <td>{polo.dre}</td>
                <td>{polo.tipoUe}</td>
                <td>{polo.nomeUe}</td>
                <td>{polo.nomeEdicao}</td>
                <td>{polo.tipoPolo}</td>
                <td>{polo.gestao}</td>

                <CelulaAcoesListagem>
                  <GrupoAcoesListagem>
                    <BotaoAcaoListagem
                      type="button"
                      aria-label={`Visualizar polo ${polo.nomeUe}`}
                      onClick={() => onVisualizarPolo(polo.id)}
                    >
                      <img src={iconeOlho} alt="" aria-hidden="true" />
                    </BotaoAcaoListagem>

                    <BotaoAcaoListagem
                      type="button"
                      aria-label={`Alterar edição do polo ${polo.nomeUe}`}
                      onClick={() => onAlterarEdicaoPolo([polo.id])}
                    >
                      <ChevronDownIcon />
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
          rotuloAcessivel="Paginação da listagem de definição de polos"
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
