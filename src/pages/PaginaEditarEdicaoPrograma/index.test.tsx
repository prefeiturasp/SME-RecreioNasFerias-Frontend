import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PaginaEditarEdicaoPrograma from './index'

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

vi.mock('@/components/edicaoPrograma/EdicaoForm', () => ({
  EdicaoForm: ({ edicaoId }: { edicaoId?: string }) => (
    <form aria-label="formulário de edição do programa">{edicaoId}</form>
  ),
}))

const idEdicao = '11111111-1111-1111-1111-111111111111'

describe('PaginaEditarEdicaoPrograma', () => {
  it('renderiza MenuLateral, Cabecalho, mapa visual e formulário', () => {
    render(
      <MemoryRouter initialEntries={[`/editar-edicao-programa/${idEdicao}`]}>
        <Routes>
          <Route
            path="/editar-edicao-programa/:idEdicao"
            element={<PaginaEditarEdicaoPrograma />}
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
        name: /editar edição do programa/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('form', { name: 'formulário de edição do programa' }),
    ).toHaveTextContent(idEdicao)
    expect(
      screen.getByRole('button', { name: /voltar para edições do programa/i }),
    ).toBeInTheDocument()
  })
})
