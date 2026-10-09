import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'

import { FiltrosInscricoesParticipantesForm } from './FiltrosInscricoesParticipantesForm'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { useGetPolosOficiais } from '@/hooks/useGetPolosOficiais'
import { useInscricoesParticipantesStore } from '@/stores/filtroInscricoesParticipantesStore'

// Mock dos hooks customizados de requisição
vi.mock('@/hooks/useGetValoresChoices', () => ({
  useGetValoresChoices: vi.fn(),
}))

vi.mock('@/hooks/useGetPolosOficiais', () => ({
  useGetPolosOficiais: vi.fn(),
}))

describe('FiltrosInscricoesParticipantesForm', () => {
  const mockChoices = {
    tipo_estudante: [
      { value: 'REGULAR', label: 'Regular' },
      { value: 'BOLSA', label: 'Bolsista' },
    ],
    grupo_inscricao: [{ value: 'GRUPO_A', label: 'Grupo A' }],
    status_inscricao: [
      { value: 'PENDENTE', label: 'Pendente' },
      { value: 'CONFIRMADO', label: 'Confirmado' },
    ],
  }

  const mockPolos = [
    { uuid: 'polo-1', nome_polo: 'Polo Centro' },
    { uuid: 'polo-2', nome_polo: 'Polo Norte' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    // Configura retornos padrão para os hooks de dados
    vi.mocked(useGetValoresChoices).mockReturnValue({
      data: mockChoices,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetValoresChoices>)

    vi.mocked(useGetPolosOficiais).mockReturnValue({
      data: mockPolos,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetPolosOficiais>)

    // Reseta o estado da store do Zustand antes de cada teste
    act(() => {
      useInscricoesParticipantesStore.getState().limparFiltros()
    })
  })

  it('deve renderizar todos os campos de filtro corretamente', () => {
    render(<FiltrosInscricoesParticipantesForm />)

    expect(
      screen.getByText('Filtrar por Tipo de Estudante'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Filtrar por Polo de Inscrição'),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Digite o Código EOL'),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o CPF')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Digite o Nome do Participante'),
    ).toBeInTheDocument()
    expect(screen.getByText('Filtrar por Agrupamento')).toBeInTheDocument()
    expect(screen.getByText('Filtrar por Status')).toBeInTheDocument()

    // Botões de ação
    expect(
      screen.getByRole('button', { name: /limpar filtros/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^filtrar$/i }),
    ).toBeInTheDocument()
  })

  it('deve exibir estado de carregamento no campo de tipo de estudante', async () => {
    const user = userEvent.setup()

    vi.mocked(useGetValoresChoices).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetValoresChoices>)

    render(<FiltrosInscricoesParticipantesForm />)

    await user.click(
      screen.getByRole('combobox', {
        name: 'Filtrar por Tipo de Estudante',
      }),
    )

    expect(
      screen.getByRole('option', { name: 'Carregando...' }),
    ).toBeInTheDocument()
  })

  it('deve exibir erro ao carregar tipos de estudante', async () => {
    const user = userEvent.setup()

    vi.mocked(useGetValoresChoices).mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useGetValoresChoices>)

    render(<FiltrosInscricoesParticipantesForm />)

    await user.click(
      screen.getByRole('combobox', {
        name: 'Filtrar por Tipo de Estudante',
      }),
    )

    expect(
      screen.getByRole('option', {
        name: 'Erro ao carregar Tipos de Estudante',
      }),
    ).toBeInTheDocument()
  })

  it('deve atualizar a store ao selecionar agrupamento e status', async () => {
    const user = userEvent.setup()
    render(<FiltrosInscricoesParticipantesForm />)

    await user.click(
      screen.getByRole('combobox', { name: 'Filtrar por Agrupamento' }),
    )
    await user.click(screen.getByRole('option', { name: 'Grupo A' }))

    await user.click(
      screen.getByRole('combobox', { name: 'Filtrar por Status' }),
    )
    await user.click(screen.getByRole('option', { name: 'Pendente' }))

    expect(useInscricoesParticipantesStore.getState().filtros.grupo).toBe(
      'GRUPO_A',
    )
    expect(useInscricoesParticipantesStore.getState().filtros.status).toBe(
      'PENDENTE',
    )
  })

  it('deve atualizar o campo de Código EOL na store ao digitar', async () => {
    const user = userEvent.setup()
    render(<FiltrosInscricoesParticipantesForm />)

    const inputEol = screen.getByPlaceholderText('Digite o Código EOL')
    await user.type(inputEol, '1234567')

    expect(useInscricoesParticipantesStore.getState().filtros.codigo_eol).toBe(
      '1234567',
    )
  })

  it('deve aplicar máscara e extrair dígitos corretamente ao digitar o CPF', async () => {
    const user = userEvent.setup()
    render(<FiltrosInscricoesParticipantesForm />)

    const inputCpf = screen.getByPlaceholderText('Digite o CPF')
    await user.type(inputCpf, '12345678901')

    // O input exibe formatado (dependendo da máscara, ex: 123.456.789-01)
    expect(inputCpf).toHaveValue('123.456.789-01')
    // A store deve armazenar apenas os dígitos limpos
    expect(useInscricoesParticipantesStore.getState().filtros.cpf).toBe(
      '12345678901',
    )
  })

  it('deve acionar limparFiltros ao clicar no botão Limpar Filtros', async () => {
    const user = userEvent.setup()

    // Altera algo na store primeiro
    act(() => {
      useInscricoesParticipantesStore
        .getState()
        .alterarFiltro('nome_participante', 'Maria')
    })

    expect(
      useInscricoesParticipantesStore.getState().filtros.nome_participante,
    ).toBe('Maria')

    render(<FiltrosInscricoesParticipantesForm />)

    const botaoLimpar = screen.getByRole('button', { name: /limpar filtros/i })
    await user.click(botaoLimpar)

    expect(
      useInscricoesParticipantesStore.getState().filtros.nome_participante,
    ).toBe('')
  })

  it('deve acionar aplicarFiltros ao clicar no botão Filtrar', async () => {
    const user = userEvent.setup()

    act(() => {
      useInscricoesParticipantesStore
        .getState()
        .alterarFiltro('nome_participante', 'Carlos')
    })

    render(<FiltrosInscricoesParticipantesForm />)

    const botaoFiltrar = screen.getByRole('button', { name: /^filtrar$/i })
    await user.click(botaoFiltrar)

    expect(
      useInscricoesParticipantesStore.getState().filtrosAplicados
        .nome_participante,
    ).toBe('Carlos')
  })
})
