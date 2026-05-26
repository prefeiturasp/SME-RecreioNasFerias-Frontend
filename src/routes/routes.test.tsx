import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './index'

describe('AppRoutes', () => {
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

  it('renderiza a página principal na rota /main', () => {
    render(
      <MemoryRouter initialEntries={['/main']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText(/conteudo principal/i)).toBeInTheDocument()
  })
})
