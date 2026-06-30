import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import PaginaDefinicoesPolo from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

describe('PaginaDefinicoesPolo', () => {
  it('renderiza o título e o botão voltar', () => {
    render(
      <MemoryRouter>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /definições de polo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
  })

  it('navega para o início ao clicar em voltar', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/definicoes-polo']}>
        <PaginaDefinicoesPolo />
      </MemoryRouter>,
    )

    await usuario.click(screen.getByRole('button', { name: /voltar ao início/i }))

    expect(
      screen.getByRole('heading', { name: /definições de polo/i }),
    ).toBeInTheDocument()
  })
})
