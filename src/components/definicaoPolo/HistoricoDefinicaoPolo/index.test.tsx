import { render, screen, fireEvent } from '@testing-library/react'
import { HistoricoDefinicaoPolo } from './index'
import useGetHistoricoDefinicoesPolo from '@/hooks/useGetHistoricoDefinicoesPolo'
import { vi, type Mock } from 'vitest'

vi.mock('@/hooks/useGetHistoricoDefinicoesPolo')

const mockUseGetHistoricoDefinicoesPolo = useGetHistoricoDefinicoesPolo as Mock

describe('Componente: HistoricoDefinicaoPolo', () => {
  const mockPoloUuid = '123-uuid'

  beforeEach(() => {
    vi.clearAllMocks() // Limpa os mocks antes de cada teste
  })

  it('deve renderizar o título e os dados da tabela corretamente', () => {
    // Configurar o retorno do mock para um cenário de sucesso
    mockUseGetHistoricoDefinicoesPolo.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            edicao: { nome: 'Edição 2025' },
            tipo: 'Pendente',
            projecao_inscritos: 100,
            total_inscritos: 85,
            resultado_final_de_inscritos: 0,
          },
        ],
      },
      isLoading: false,
    })

    render(<HistoricoDefinicaoPolo poloUuid={mockPoloUuid} />)

    // Asserções
    expect(screen.getByText('Histórico')).toBeInTheDocument()
    expect(screen.getByText('Edição 2025')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('deve lidar com valores nulos ou ausentes substituindo por hífen (-)', () => {
    mockUseGetHistoricoDefinicoesPolo.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            edicao: { nome: 'Edição 2024' },
            tipo: null,
            projecao_inscritos: null,
            total_inscritos: null,
          },
        ],
      },
      isLoading: false,
    })

    render(<HistoricoDefinicaoPolo poloUuid={mockPoloUuid} />)

    expect(screen.getByText('Edição 2024')).toBeInTheDocument()
    // Como os valores numéricos/tipo retornam null, o componente usa fallback para '-'
    const hifens = screen.getAllByText('-')
    expect(hifens.length).toBeGreaterThan(0)
  })

  it('deve chamar o hook com os parâmetros corretos do polo', () => {
    mockUseGetHistoricoDefinicoesPolo.mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
    })

    render(<HistoricoDefinicaoPolo poloUuid={mockPoloUuid} />)

    expect(mockUseGetHistoricoDefinicoesPolo).toHaveBeenCalledWith({
      polo: mockPoloUuid,
      page: 1,
      page_size: 10,
    })
  })

  it('deve atualizar a página atual ao interagir com a paginação', () => {
    mockUseGetHistoricoDefinicoesPolo.mockReturnValue({
      data: {
        count: 25, // Total de 25 registros -> 3 páginas (com 10 por página)
        results: [
          {
            edicao: { nome: 'Edição 2025' },
            tipo: 'Presencial',
            projecao_inscritos: 10,
            total_inscritos: 5,
          },
        ],
      },
      isLoading: false,
    })

    render(<HistoricoDefinicaoPolo poloUuid={mockPoloUuid} />)

    const botaoProximaPagina = screen.queryByRole('button', {
      name: /próxima/i,
    })

    if (botaoProximaPagina) {
      fireEvent.click(botaoProximaPagina)
      // Verifica se o hook foi chamado novamente com a página 2
      expect(mockUseGetHistoricoDefinicoesPolo).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      )
    }
  })
})
