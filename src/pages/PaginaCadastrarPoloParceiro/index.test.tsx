import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PaginaCadastrarPoloParceiro from './index'

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
  PoloForm: () => <form aria-label="formulário de polo" />,
}))

describe('PaginaCadastrarPoloParceiro', () => {
  it('renderiza MenuLateral, Cabecalho, mapa visual e formulário', () => {
    render(
      <MemoryRouter>
        <PaginaCadastrarPoloParceiro />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /cadastrar polo parceiro/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'formulário de polo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /voltar para cadastro de polos parceiros/i,
      }),
    ).toBeInTheDocument()
  })
})
