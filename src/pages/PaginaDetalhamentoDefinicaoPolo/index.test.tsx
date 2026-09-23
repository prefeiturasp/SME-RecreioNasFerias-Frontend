import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PaginaDetalhamentoDefinicaoPolo from './index'

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

vi.mock('@/components/definicaoPolo/DefinicaoPoloForm', () => ({
  DefinicaoPoloForm: ({ definicaoUuid }: { definicaoUuid: string }) => (
    <form aria-label="formulário de detalhamento do polo">{definicaoUuid}</form>
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

const idDefinicao = '11c43c20-dfcb-4a26-a677-30703b7de766'

function renderPagina() {
  return render(
    <MemoryRouter initialEntries={[`/definicoes-polo/${idDefinicao}`]}>
      <Routes>
        <Route
          path="/definicoes-polo/:idDefinicao"
          element={<PaginaDetalhamentoDefinicaoPolo />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PaginaDetalhamentoDefinicaoPolo', () => {
  beforeEach(() => {
    navegarMock.mockReset()
  })

  it('renderiza MenuLateral, Cabecalho, mapa visual e formulário', () => {
    renderPagina()

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /detalhamento do polo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'formulário de detalhamento do polo' }),
    ).toHaveTextContent(idDefinicao)
    expect(
      screen.getByRole('button', {
        name: /voltar para definição de polos/i,
      }),
    ).toBeInTheDocument()
  })

  it('navega para a listagem ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    renderPagina()

    await usuario.click(
      screen.getByRole('button', {
        name: /voltar para definição de polos/i,
      }),
    )

    expect(navegarMock).toHaveBeenCalledWith('/definicoes-polo')
  })
})
