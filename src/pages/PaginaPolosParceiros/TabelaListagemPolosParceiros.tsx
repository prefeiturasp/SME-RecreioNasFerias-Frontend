import { useMemo, useState } from 'react'

import { iconeLapisEditar } from '../../assets'
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
import { IconeOrdenacaoTabela } from '../../components/icons'
import type { PoloParceiro } from '../../services/poloParceiro/types'

type ColunaOrdenacao = 'dre' | 'tipoUe' | 'nomePolo' | 'nomeOsc'

type DirecaoOrdenacao = 'asc' | 'desc'

type TabelaListagemPolosParceirosProps = {
  polos: PoloParceiro[]
  paginaAtual: number
  totalPaginas: number
  itensPorPagina: number
  onMudarPagina: (pagina: number) => void
  onMudarItensPorPagina: (itensPorPagina: number) => void
  onEditarPolo: (idPolo: string) => void
}

const COLUNAS_ORDENAVEIS: { id: ColunaOrdenacao; rotulo: string }[] = [
  { id: 'dre', rotulo: 'DRE' },
  { id: 'tipoUe', rotulo: 'Tipo de UE' },
  { id: 'nomePolo', rotulo: 'Nome do Polo' },
  { id: 'nomeOsc', rotulo: 'Nome da OSC' },
]

function obterValorOrdenacao(
  polo: PoloParceiro,
  coluna: ColunaOrdenacao,
): string {
  return polo[coluna].toLowerCase()
}

export function TabelaListagemPolosParceiros({
  polos,
  paginaAtual,
  totalPaginas,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
  onEditarPolo,
}: Readonly<TabelaListagemPolosParceirosProps>) {
  const [colunaOrdenacao, setColunaOrdenacao] =
    useState<ColunaOrdenacao>('nomePolo')
  const [direcaoOrdenacao, setDirecaoOrdenacao] =
    useState<DirecaoOrdenacao>('asc')
  const [polosSelecionados, setPolosSelecionados] = useState<Set<string>>(
    () => new Set(),
  )

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
  const todosSelecionados =
    idsPolosPagina.length > 0 &&
    idsPolosPagina.every((id) => polosSelecionados.has(id))
  const selecaoParcial =
    idsPolosPagina.some((id) => polosSelecionados.has(id)) && !todosSelecionados

  const alternarOrdenacao = (coluna: ColunaOrdenacao) => {
    if (colunaOrdenacao === coluna) {
      setDirecaoOrdenacao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
      return
    }

    setColunaOrdenacao(coluna)
    setDirecaoOrdenacao('asc')
  }

  const alternarSelecaoPolo = (idPolo: string, selecionado: boolean) => {
    setPolosSelecionados((atual) => {
      const proximo = new Set(atual)

      if (selecionado) {
        proximo.add(idPolo)
      } else {
        proximo.delete(idPolo)
      }

      return proximo
    })
  }

  const alternarSelecaoTodos = (selecionado: boolean) => {
    setPolosSelecionados((atual) => {
      const proximo = new Set(atual)

      if (selecionado) {
        idsPolosPagina.forEach((id) => proximo.add(id))
      } else {
        idsPolosPagina.forEach((id) => proximo.delete(id))
      }

      return proximo
    })
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
                    aria-label={`Selecionar polo ${polo.nomePolo}`}
                    checked={polosSelecionados.has(polo.id)}
                    onChange={(evento) =>
                      alternarSelecaoPolo(polo.id, evento.target.checked)
                    }
                  />
                </CelulaCheckboxListagem>

                <td>{polo.dre}</td>
                <td>{polo.tipoUe}</td>
                <td>{polo.nomePolo}</td>
                <td>{polo.nomeOsc}</td>

                <CelulaAcoesListagem>
                  <GrupoAcoesListagem>
                    <BotaoAcaoListagem
                      type="button"
                      aria-label={`Editar polo ${polo.nomePolo}`}
                      onClick={() => onEditarPolo(polo.id)}
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
          rotuloAcessivel="Paginação da listagem de polos parceiros"
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
