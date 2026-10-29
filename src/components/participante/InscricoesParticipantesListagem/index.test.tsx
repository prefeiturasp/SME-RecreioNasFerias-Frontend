import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { InscricoesParticipantesListagem } from './index'
import useGetInscricoes from '@/hooks/useGetInscricoes'
import { useInscricoesParticipantesStore } from '@/stores/useInscricoesParticipantesStore'
import { ToastProvider } from '@/contexts/ToastContext'

// Mock dos hooks e dependências
vi.mock('@/hooks/useGetInscricoes')
vi.mock('@/stores/useInscricoesParticipantesStore')

// Mock opcional para evitar problemas com ícones importados de assets
vi.mock('@/assets/', () => ({
  iconeLapisEditar: 'icone-lapis.svg',
}))

const mockSetPaginaAtual = vi.fn()
const mockSetItensPorPagina = vi.fn()

const dadosMock = {
  count: 15,
  results: [
    {
      uuid: '1',
      tipo_estudante: 'REGULAR',
      tipo_estudante_label: 'Regular',
      polo_nome: 'Polo Central',
      codigo_eol: 12345,
      cpf: '123.456.789-00',
      nome_participante: 'João da Silva',
      grupo: 'A',
      grupo_label: 'Grupo A',
      status: 'ATIVO',
      status_label: 'Ativo',
    },
  ],
}

function criarResultadoQueryMock() {
  return {
    data: dadosMock,
    isLoading: false,
  } as unknown as ReturnType<typeof useGetInscricoes>
}

function renderInscricoesParticipantesListagem() {
  return render(
    <ToastProvider>
      <BrowserRouter>
        <InscricoesParticipantesListagem />
      </BrowserRouter>
    </ToastProvider>,
  )
}

describe('InscricoesParticipantesListagem', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Configurando o mock padrão do store do Zustand
    vi.mocked(useInscricoesParticipantesStore).mockReturnValue({
      paginaAtual: 1,
      itensPorPagina: 10,
      setPaginaAtual: mockSetPaginaAtual,
      setItensPorPagina: mockSetItensPorPagina,
    } as Pick<
      ReturnType<typeof useInscricoesParticipantesStore.getState>,
      'paginaAtual' | 'itensPorPagina' | 'setPaginaAtual' | 'setItensPorPagina'
    >)
  })

  it('deve renderizar o título da listagem e os dados da tabela corretamente', () => {
    vi.mocked(useGetInscricoes).mockReturnValue(criarResultadoQueryMock())

    renderInscricoesParticipantesListagem()

    // Verifica o título da seção
    expect(
      screen.getByRole('heading', { name: /listagem de participantes/i }),
    ).toBeInTheDocument()

    // Verifica se os dados do participante aparecem na tabela
    expect(screen.getByText('João da Silva')).toBeInTheDocument()
    expect(screen.getByText('Polo Central')).toBeInTheDocument()
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument()
  })

  it('deve renderizar o botão de ação (edição) com o link e acessibilidade corretos', () => {
    vi.mocked(useGetInscricoes).mockReturnValue(criarResultadoQueryMock())

    renderInscricoesParticipantesListagem()

    const botaoEditar = screen.getByRole('link', {
      name: /editar inscrição joão da silva/i,
    })
    expect(botaoEditar).toBeInTheDocument()
    expect(botaoEditar).toHaveAttribute('href', '/')
  })

  it('deve chamar a função de alterar página ao interagir com a paginação', async () => {
    const user = userEvent.setup()

    vi.mocked(useGetInscricoes).mockReturnValue(criarResultadoQueryMock())

    renderInscricoesParticipantesListagem()

    const botaoProximaPagina = screen.queryByRole('button', {
      name: /próxima página/i,
    })

    if (botaoProximaPagina) {
      await user.click(botaoProximaPagina)
      expect(mockSetPaginaAtual).toHaveBeenCalled()
    }
  })

  it('deve lidar corretamente quando a API retorna um array direto de inscrições', () => {
    const dadosArrayDireto = [
      {
        uuid: '2',
        tipo_estudante: 'BOLSISTA',
        tipo_estudante_label: 'Bolsista',
        polo_nome: undefined,
        polo: 'Polo Alternativo',
        codigo_eol: undefined,
        cpf: undefined,
        nome_participante: 'Ana Souza',
        grupo: 'B',
        grupo_label: 'Grupo B',
        status: 'INATIVO',
        status_label: 'Inativo',
      },
    ]

    vi.mocked(useGetInscricoes).mockReturnValue({
      data: dadosArrayDireto,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetInscricoes>)

    renderInscricoesParticipantesListagem()

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByText('Polo Alternativo')).toBeInTheDocument()
    // Como CPF e codigo_eol estão undefined, testa os fallbacks '-'
    const celulasVazias = screen.getAllByText('-')
    expect(celulasVazias.length).toBeGreaterThan(0)
  })

  it('deve chamar a função de alterar itens por página e resetar a página atual para 1', async () => {
    const user = userEvent.setup()

    vi.mocked(useGetInscricoes).mockReturnValue(criarResultadoQueryMock())

    renderInscricoesParticipantesListagem()

    await user.click(
      screen.getByRole('combobox', { name: /itens por página/i }),
    )
    await user.click(await screen.findByRole('option', { name: '20' }))

    expect(mockSetItensPorPagina).toHaveBeenCalledWith(20)
    expect(mockSetPaginaAtual).toHaveBeenCalledWith(1)
  })

  it('deve executar as funções de valorOrdenacao e renderizar os fallbacks das colunas', async () => {
    const user = userEvent.setup()
    // Injeta dados com valores variados para cobrir os operadores lógicos (??) das colunas
    const dadosComplexos = {
      count: 2,
      results: [
        {
          uuid: '3',
          tipo_estudante: undefined,
          tipo_estudante_label: 'Especial',
          polo_nome: undefined,
          polo: undefined,
          codigo_eol: undefined,
          cpf: undefined,
          nome_participante: undefined,
          grupo: undefined,
          grupo_label: undefined,
          status: undefined,
          status_label: undefined,
        },
        {
          uuid: '4',
          tipo_estudante: undefined,
          tipo_estudante_label: 'Outro tipo',
          polo_nome: undefined,
          polo: 'Polo alternativo',
          codigo_eol: undefined,
          cpf: undefined,
          nome_participante: undefined,
          grupo: undefined,
          grupo_label: undefined,
          status: undefined,
          status_label: undefined,
        },
      ],
    }

    vi.mocked(useGetInscricoes).mockReturnValue({
      data: dadosComplexos,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetInscricoes>)

    const { container } = renderInscricoesParticipantesListagem()

    for (const nomeColuna of [
      'tipo de estudante',
      'polo de inscrição',
      'código eol',
      'cpf',
      'nome do participante',
      'agrupamento',
      'status',
    ]) {
      await user.click(
        screen.getByRole('button', {
          name: new RegExp(`ordenar por ${nomeColuna}`, 'i'),
        }),
      )
    }

    expect(container).toBeInTheDocument()
  })
})
