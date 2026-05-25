import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from './index'

describe('Header', () => {
  it('renderiza o título do sistema', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText(/recreio nas férias/i)).toBeInTheDocument()
  })

  it('renderiza os links de navegação', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: /inscrição/i })).toHaveAttribute(
      'href',
      '/inscricao',
    )
  })
})
