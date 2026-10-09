import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InscricoesParticipantesConteudo } from './index'
import { useGetInscricoes } from '@/hooks/useGetInscricoes'

// Mock do hook useGetInscricoes para isolar o componente
vi.mock('@/hooks/useGetInscricoes', () => ({
  useGetInscricoes: vi.fn(),
}))

vi.mock('./FiltrosInscricoesParticipantesForm', () => ({
  FiltrosInscricoesParticipantesForm: () => (
    <div data-testid="mock-filtros-form">Filtros Form Mock</div>
  ),
}))

describe('InscricoesParticipantesConteudo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o container de conteúdo e o formulário de filtros corretamente', () => {
    // Configura o retorno padrão do hook de inscrições
    vi.mocked(useGetInscricoes).mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    } as unknown as ReturnType<typeof useGetInscricoes>)

    render(<InscricoesParticipantesConteudo />)

    // Verifica se o hook foi acionado
    expect(useGetInscricoes).toHaveBeenCalledTimes(1)

    // Verifica se o formulário mockado (ou real) está presente na tela
    const formularioFiltros = screen.getByTestId('mock-filtros-form')
    expect(formularioFiltros).toBeInTheDocument()
  })

  it('deve lidar corretamente quando a listagem estiver em estado de carregamento', () => {
    vi.mocked(useGetInscricoes).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetInscricoes>)

    render(<InscricoesParticipantesConteudo />)

    expect(useGetInscricoes).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('mock-filtros-form')).toBeInTheDocument()
  })
})
