import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PaginaEdicoesPrograma from './index'

vi.mock('../../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

vi.mock('../../components/Cabecalho', () => ({
  Cabecalho: () => <header>Header principal</header>,
}))

vi.mock('../../components/MapaVisual', () => ({
  MapaVisual: () => <nav aria-label="Mapa do site">Mapa visual</nav>,
}))

vi.mock('../../components/edicaoPrograma/EdicaoListagem', () => ({
  EdicaoListagem: () => <div>Listagem de edições</div>,
}))

describe('PaginaEdicoesPrograma', () => {
  it('renderiza MenuLateral, Cabecalho, mapa visual e listagem', () => {
    render(
      <MemoryRouter>
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/menu lateral/i)).toBeInTheDocument()
    expect(screen.getByText(/header principal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mapa do site/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /edições do programa/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Listagem de edições')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /cadastrar nova edição do programa/i,
      }),
    ).toBeInTheDocument()
  })

  it('exibe mensagem de sucesso ao retornar do cadastro', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/edicoes-programa',
            state: { edicaoCadastrada: true },
          },
        ]}
      >
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/edição do programa cadastrado com sucesso/i),
    ).toBeInTheDocument()
  })

  it('exibe mensagem de sucesso ao retornar da atualização', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/edicoes-programa',
            state: { edicaoAtualizada: true },
          },
        ]}
      >
        <PaginaEdicoesPrograma />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/edição do programa atualizada com sucesso/i),
    ).toBeInTheDocument()
  })
})
