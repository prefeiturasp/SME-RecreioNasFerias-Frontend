import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { definirSessaoAutenticacao } from '../services/autenticacao'
import { RotasAplicacao } from './index'

vi.mock('../components/MenuLateral', () => ({
  MenuLateral: () => <aside aria-label="menu lateral">Menu lateral</aside>,
}))

describe('RotasAplicacao', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza a página inicial na rota raiz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('redireciona para login ao acessar /inicio sem autenticação', () => {
    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /mapa do site/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza a página principal na rota /inicio quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
  })

  it('redireciona para login ao acessar /edicoes-programa sem autenticação', () => {
    render(
      <MemoryRouter initialEntries={['/edicoes-programa']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /mapa do site/i }),
    ).not.toBeInTheDocument()
  })

  it('renderiza a página Edições do Programa na rota /edicoes-programa quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })

    render(
      <MemoryRouter initialEntries={['/edicoes-programa']}>
        <RotasAplicacao />
      </MemoryRouter>,
    )

    const mapa = screen.getByRole('navigation', { name: /mapa do site/i })
    expect(mapa).toHaveTextContent('Início')
    expect(mapa).toHaveTextContent('Cadastros')
    expect(mapa).toHaveTextContent('Edições do programa')
  })
})
