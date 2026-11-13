import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PaginaEditarParticipante from './index'

vi.mock('@/assets/icone-seta-voltar.png', () => ({
  default: 'icone-seta-voltar-stub.png',
}))

vi.mock('@/components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('@/components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

vi.mock('@/components/participante/ParticipanteForm', () => ({
  ParticipanteForm: ({ inscricaoId }: { inscricaoId?: string }) => (
    <form aria-label="formulário de edição de participante">{inscricaoId}</form>
  ),
}))

const { navegarMock } = vi.hoisted(() => ({
  navegarMock: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

function renderPagina() {
  return render(
    <MemoryRouter initialEntries={['/editar-participante/inscricao-1']}>
      <Routes>
        <Route
          path="/editar-participante/:idInscricao"
          element={<PaginaEditarParticipante />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PaginaEditarParticipante', () => {
  beforeEach(() => {
    navegarMock.mockReset()
  })

  it('renderiza MenuLateral, Cabecalho, mapa visual, título e voltar', () => {
    renderPagina()

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /editar participante/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar para o início/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('form', {
        name: 'formulário de edição de participante',
      }),
    ).toHaveTextContent('inscricao-1')
  })

  it('navega para a consulta de inscrições ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /voltar para o início/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/inscricoes-participantes')
  })
})
