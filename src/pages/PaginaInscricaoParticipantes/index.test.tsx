import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import PaginaInscricaoParticipantes from './index'

// Mock do hook useNavigate do react-router-dom para espiar as navegações
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock dos componentes filhos estruturais para isolar o teste da página
vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <nav data-testid="mock-menu-lateral">Menu Lateral</nav>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header data-testid="mock-cabecalho">Cabeçalho</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <div data-testid="mock-mapa-visual">Mapa Visual</div>,
}))

vi.mock('@/components/participante/InscricoesParticipantesconteudo', () => ({
  InscricoesParticipantesConteudo: () => (
    <div data-testid="mock-conteudo-inscricoes">Conteúdo Inscrições</div>
  ),
}))

describe('PaginaInscricaoParticipantes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper para renderizar componentes que utilizam rotas
  const renderPagina = () => {
    return render(
      <BrowserRouter>
        <PaginaInscricaoParticipantes />
      </BrowserRouter>,
    )
  }

  it('deve renderizar a estrutura principal da página e seus componentes visuais', () => {
    renderPagina()

    // Verifica se os blocos estruturais/layout estão presentes
    expect(screen.getByTestId('mock-menu-lateral')).toBeInTheDocument()
    expect(screen.getByTestId('mock-cabecalho')).toBeInTheDocument()
    expect(screen.getByTestId('mock-mapa-visual')).toBeInTheDocument()
    expect(screen.getByTestId('mock-conteudo-inscricoes')).toBeInTheDocument()

    // Verifica o título principal da seção
    expect(
      screen.getByRole('heading', { name: /inscrições de participantes/i }),
    ).toBeInTheDocument()
  })

  it('deve renderizar os botões de ação com os textos corretos', () => {
    renderPagina()

    expect(
      screen.getByRole('button', { name: /voltar para o início/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /cadastrar participante/i }),
    ).toBeInTheDocument()
  })

  it('deve navegar para a rota /inicio ao clicar no botão Voltar', async () => {
    const user = userEvent.setup()
    renderPagina()

    const botaoVoltar = screen.getByRole('button', {
      name: /voltar para o início/i,
    })
    await user.click(botaoVoltar)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/inicio')
  })

  it('deve navegar para a rota /inscricoes-participantes/cadastro ao clicar no botão Cadastrar Participante', async () => {
    const user = userEvent.setup()
    renderPagina()

    const botaoCadastrar = screen.getByRole('button', {
      name: /cadastrar participante/i,
    })
    await user.click(botaoCadastrar)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      '/inscricoes-participantes/cadastro',
    )
  })
})
