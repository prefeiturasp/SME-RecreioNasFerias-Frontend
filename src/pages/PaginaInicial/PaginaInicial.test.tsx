import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '@/contexts/ToastContext'
import PaginaInicial from './index'

vi.mock('@/components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('@/components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('@/components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

describe('PaginaInicial', () => {
  it('renderiza MenuLateral, Cabecalho e mapa visual', () => {
    render(
      <ToastProvider>
        <MemoryRouter>
          <PaginaInicial />
        </MemoryRouter>
      </ToastProvider>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
  })
})
