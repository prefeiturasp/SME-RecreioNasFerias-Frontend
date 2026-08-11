import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PaginaInicial from './index'

vi.mock('@/components/shared/menu-lateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/shared/cabecalho-pagina', () => ({
  CabecalhoPagina: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

describe('PaginaInicial', () => {
  it('renderiza MenuLateral, CabecalhoPagina e mapa visual', () => {
    render(<PaginaInicial />)

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
  })
})
