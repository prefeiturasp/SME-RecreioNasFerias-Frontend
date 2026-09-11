import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PaginaDefinicoesPolo from './index'

vi.mock('@/components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('@/components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

vi.mock('@/components/definicaoPolo/DefinicaoPolosConteudo', () => ({
  DefinicaoPolosConteudo: () => (
    <div>Conteúdo de definição de polos</div>
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
    <MemoryRouter>
      <PaginaDefinicoesPolo />
    </MemoryRouter>,
  )
}

describe('PaginaDefinicoesPolo', () => {
  beforeEach(() => {
    navegarMock.mockReset()
  })

  it('renderiza chrome da página e conteúdo mockado', () => {
    renderPagina()

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /definição de polos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/conteúdo de definição de polos/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
  })

  it('navega para o início ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', { name: /voltar ao início/i }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/inicio')
  })
})
