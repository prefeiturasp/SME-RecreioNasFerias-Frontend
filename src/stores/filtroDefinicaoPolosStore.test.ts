import { act } from '@testing-library/react'
import { useDefinicaoPoloStore } from './filtroDefinicaoPolosStore'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'

// Reseta a store antes de cada teste para garantir isolamento
const initialState = useDefinicaoPoloStore.getState()
beforeEach(() => {
  useDefinicaoPoloStore.setState(initialState, true)
})

describe('useDefinicaoPoloStore', () => {
  it('deve inicializar com os filtros padrão', () => {
    const state = useDefinicaoPoloStore.getState()

    expect(state.filtros).toEqual(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
    expect(state.filtrosAplicados).toEqual(
      FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    )
  })

  it('deve alterar um filtro específico corretamente', () => {
    act(() => {
      useDefinicaoPoloStore
        .getState()
        .alterarFiltro(
          'dre_codigos_eol',
          'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
        )
    })

    const state = useDefinicaoPoloStore.getState()
    expect(state.filtros.dre_codigos_eol).toBe(
      'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    )
    // O filtro aplicado ainda deve continuar com o valor inicial até ser aplicado
    expect(state.filtrosAplicados.dre_codigos_eol).not.toBe(
      'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    )
  })

  it('deve definir todos os filtros de uma vez', () => {
    const novosFiltros = {
      ...FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
      nome: 'Polo Norte',
      status: 'ativo',
    }

    act(() => {
      useDefinicaoPoloStore.getState().definirFiltros(novosFiltros)
    })

    const state = useDefinicaoPoloStore.getState()
    expect(state.filtros).toEqual(novosFiltros)
  })

  it('deve aplicar os filtros correntes para filtrosAplicados', () => {
    act(() => {
      useDefinicaoPoloStore
        .getState()
        .alterarFiltro(
          'dre_codigos_eol',
          'DIRETORIA REGIONAL DE EDUCACAO PENHA',
        )
      useDefinicaoPoloStore.getState().aplicarFiltros()
    })

    const state = useDefinicaoPoloStore.getState()
    expect(state.filtrosAplicados.dre_codigos_eol).toBe(
      'DIRETORIA REGIONAL DE EDUCACAO PENHA',
    )
    expect(state.filtrosAplicados).toEqual(state.filtros)
  })

  it('deve limpar todos os filtros retornando ao estado inicial', () => {
    act(() => {
      useDefinicaoPoloStore
        .getState()
        .alterarFiltro(
          'dre_codigos_eol',
          'DIRETORIA REGIONAL DE EDUCACAO LESTE',
        )
      useDefinicaoPoloStore.getState().aplicarFiltros()

      // Limpa tudo
      useDefinicaoPoloStore.getState().limparFiltros()
    })

    const state = useDefinicaoPoloStore.getState()
    expect(state.filtros).toEqual(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
    expect(state.filtrosAplicados).toEqual(
      FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
    )
  })
})
