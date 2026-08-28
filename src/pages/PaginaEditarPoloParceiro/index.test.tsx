import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PaginaEditarPoloParceiro from './index'

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

vi.mock('@/components/polo/PoloForm', () => ({
  PoloForm: ({ poloId }: { poloId?: string }) => (
    <form aria-label="formulário de polo">{poloId}</form>
  ),
}))

const idPolo = '11111111-1111-1111-1111-111111111111'

describe('PaginaEditarPoloParceiro', () => {
  it('renderiza MenuLateral, Cabecalho, mapa visual e formulário', () => {
    render(
      <MemoryRouter initialEntries={[`/editar-polo-parceiro/${idPolo}`]}>
        <Routes>
          <Route
            path="/editar-polo-parceiro/:idPolo"
            element={<PaginaEditarPoloParceiro />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /editar polo parceiro/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'formulário de polo' })).toHaveTextContent(
      idPolo,
    )
    expect(
      screen.getByRole('button', {
        name: /voltar para cadastro de polos parceiros/i,
      }),
    ).toBeInTheDocument()
  })
})
