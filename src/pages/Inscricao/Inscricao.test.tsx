import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Inscricao from './index'

describe('Inscricao', () => {
  it('renderiza o título da página', () => {
    render(<Inscricao />)

    expect(
      screen.getByRole('heading', { name: /^inscrição$/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a mensagem de formulário em breve', () => {
    render(<Inscricao />)

    expect(
      screen.getByText(/formulário de inscrição em breve/i),
    ).toBeInTheDocument()
  })
})
