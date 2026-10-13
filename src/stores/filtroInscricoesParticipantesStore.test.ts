import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useInscricoesParticipantesStore } from './filtroInscricoesParticipantesStore'
import { FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS } from '../services/inscricao/types'

describe('useInscricoesParticipantesStore', () => {
  // Reseta o estado da store para o inicial antes de cada teste
  beforeEach(() => {
    act(() => {
      useInscricoesParticipantesStore.getState().limparFiltros()
      useInscricoesParticipantesStore.getState().setItensPorPagina(10)
    })
  })

  it('deve inicializar com os valores padrão corretos', () => {
    const estado = useInscricoesParticipantesStore.getState()

    expect(estado.paginaAtual).toBe(1)
    expect(estado.itensPorPagina).toBe(10)
    expect(estado.filtros).toEqual(
      FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
    )
    expect(estado.filtrosAplicados).toEqual(
      FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
    )
  })

  it('deve alterar a página atual corretamente', () => {
    const { setPaginaAtual } = useInscricoesParticipantesStore.getState()

    act(() => {
      setPaginaAtual(3)
    })

    expect(useInscricoesParticipantesStore.getState().paginaAtual).toBe(3)
  })

  it('deve alterar a quantidade de itens por página corretamente', () => {
    const { setItensPorPagina } = useInscricoesParticipantesStore.getState()

    act(() => {
      setItensPorPagina(25)
    })

    expect(useInscricoesParticipantesStore.getState().itensPorPagina).toBe(25)
  })

  it('deve definir todos os filtros de uma vez', () => {
    const { definirFiltros } = useInscricoesParticipantesStore.getState()
    const novosFiltros = {
      ...FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
      nome_participante: 'João',
      cpf: '123.456.789-00',
      grupo: 'MINI_GRUPO_I',
      status: 'COMPLETA',
      polo: 'uuid-1234',
      codigo_eol: '1234567',
      tipo_estudante: 'ESTUDANTE_DA_REDE',
    }

    act(() => {
      definirFiltros(novosFiltros)
    })

    expect(useInscricoesParticipantesStore.getState().filtros).toEqual(
      novosFiltros,
    )
    // Os filtros aplicados ainda devem continuar com o valor antigo até que aplicarFiltros seja chamado
    expect(useInscricoesParticipantesStore.getState().filtrosAplicados).toEqual(
      FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
    )
  })

  it('deve alterar um filtro específico individualmente', () => {
    const { alterarFiltro } = useInscricoesParticipantesStore.getState()

    act(() => {
      alterarFiltro('nome_participante', 'Maria')
    })

    expect(
      useInscricoesParticipantesStore.getState().filtros.nome_participante,
    ).toBe('Maria')
  })

  it('deve aplicar os filtros correntes para filtrosAplicados', () => {
    const { alterarFiltro, aplicarFiltros } =
      useInscricoesParticipantesStore.getState()

    act(() => {
      alterarFiltro('nome_participante', 'Carlos')
      aplicarFiltros()
    })

    expect(
      useInscricoesParticipantesStore.getState().filtrosAplicados
        .nome_participante,
    ).toBe('Carlos')
    expect(useInscricoesParticipantesStore.getState().filtrosAplicados).toEqual(
      useInscricoesParticipantesStore.getState().filtros,
    )
  })

  it('deve limpar os filtros e resetar a página atual para 1', () => {
    const { alterarFiltro, aplicarFiltros, setPaginaAtual, limparFiltros } =
      useInscricoesParticipantesStore.getState()

    act(() => {
      alterarFiltro('nome_participante', 'Ana')
      aplicarFiltros()
      setPaginaAtual(4)
    })

    // Garante que alterou
    expect(useInscricoesParticipantesStore.getState().paginaAtual).toBe(4)
    expect(
      useInscricoesParticipantesStore.getState().filtros.nome_participante,
    ).toBe('Ana')

    // Executa a limpeza
    act(() => {
      limparFiltros()
    })

    const estadoAposLimpeza = useInscricoesParticipantesStore.getState()
    expect(estadoAposLimpeza.paginaAtual).toBe(1)
    expect(estadoAposLimpeza.filtros).toEqual(
      FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
    )
    expect(estadoAposLimpeza.filtrosAplicados).toEqual(
      FILTROS_LISTAGEM_INSCRICOES_PARTICIPANTES_INICIAIS,
    )
  })
})
