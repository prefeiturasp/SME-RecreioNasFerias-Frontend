import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from './index'

describe('Home', () => {
  it('renderiza o título de boas-vindas', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { name: /bem-vindo/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a descrição da página inicial', () => {
    render(<Home />)

    expect(
      screen.getByText(/página inicial do recreio nas férias/i),
    ).toBeInTheDocument()
  })
})
