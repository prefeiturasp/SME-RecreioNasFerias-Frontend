import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAuthSession } from '../services/auth'
import { AppRoutes } from './index'

describe('AppRoutes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza a página inicial na rota raiz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('redireciona para login ao acessar /main sem autenticação', () => {
    render(
      <MemoryRouter initialEntries={['/main']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /início/i })).not.toBeInTheDocument()
  })

  it('renderiza a página principal na rota /main quando autenticado', () => {
    setAuthSession({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })

    render(
      <MemoryRouter initialEntries={['/main']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: /início/i,
      }),
    ).toBeInTheDocument()
  })
})
