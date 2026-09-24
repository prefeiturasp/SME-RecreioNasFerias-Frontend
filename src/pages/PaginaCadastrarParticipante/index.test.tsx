import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PaginaCadastrarParticipante from './index'

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

describe('PaginaCadastrarParticipante', () => {
  beforeEach(() => {
    navegarMock.mockReset()
  })

  it('renderiza MenuLateral, Cabecalho, mapa visual, título e voltar', () => {
    render(
      <MemoryRouter>
        <PaginaCadastrarParticipante />
      </MemoryRouter>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /cadastrar participante/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar para o início/i }),
    ).toBeInTheDocument()
  })

  it('navega para o início ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <PaginaCadastrarParticipante />
      </MemoryRouter>,
    )

    await usuario.click(
      screen.getByRole('button', { name: /voltar para o início/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/inicio')
  })
})
