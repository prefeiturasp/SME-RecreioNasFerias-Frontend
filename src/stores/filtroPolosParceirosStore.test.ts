import { act } from '@testing-library/react'
import { usePoloParceiroStore } from './filtroPolosParceirosStore'
import { FILTROS_POLO_INICIAIS } from '@/constants/filtroPolos'

// Reseta a store antes de cada teste para garantir isolamento total
const initialState = usePoloParceiroStore.getState()
beforeEach(() => {
  usePoloParceiroStore.setState(initialState, true)
})

describe('usePoloParceiroStore', () => {
  it('deve inicializar com os filtros padrão', () => {
    const state = usePoloParceiroStore.getState()

    expect(state.filtros).toEqual(FILTROS_POLO_INICIAIS)
    expect(state.filtrosAplicados).toEqual(FILTROS_POLO_INICIAIS)
  })

  it('deve alterar um filtro específico corretamente', () => {
    act(() => {
      usePoloParceiroStore.getState().alterarFiltro('busca', 'Parceiro Exemplo')
    })

    const state = usePoloParceiroStore.getState()
    expect(state.filtros.busca).toBe('Parceiro Exemplo')
    // O filtro aplicado deve permanecer inalterado até que o usuário clique em aplicar
    expect(state.filtrosAplicados.busca).not.toBe('Parceiro Exemplo')
  })

  it('deve definir todos os filtros de uma vez', () => {
    const novosFiltros = {
      ...FILTROS_POLO_INICIAIS,
      busca: 'Novo Polo',
    }

    act(() => {
      usePoloParceiroStore.getState().definirFiltros(novosFiltros)
    })

    const state = usePoloParceiroStore.getState()
    expect(state.filtros).toEqual(novosFiltros)
  })

  it('deve aplicar os filtros correntes para filtrosAplicados', () => {
    act(() => {
      usePoloParceiroStore.getState().alterarFiltro('busca', 'Polo Aplicado')
      usePoloParceiroStore.getState().aplicarFiltros()
    })

    const state = usePoloParceiroStore.getState()
    expect(state.filtrosAplicados.busca).toBe('Polo Aplicado')
    expect(state.filtrosAplicados).toEqual(state.filtros)
  })

  it('deve limpar todos os filtros retornando ao estado inicial', () => {
    act(() => {
      usePoloParceiroStore.getState().alterarFiltro('busca', 'Polo Temporário')
      usePoloParceiroStore.getState().aplicarFiltros()

      // Aciona a limpeza
      usePoloParceiroStore.getState().limparFiltros()
    })

    const state = usePoloParceiroStore.getState()
    expect(state.filtros).toEqual(FILTROS_POLO_INICIAIS)
    expect(state.filtrosAplicados).toEqual(FILTROS_POLO_INICIAIS)
  })
})
