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

    expect(
      screen.getByRole('heading', { name: /bem-vindo/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a página de inscrição', () => {
    render(
      <MemoryRouter initialEntries={['/inscricao']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /^inscrição$/i }),
    ).toBeInTheDocument()
  })
})
