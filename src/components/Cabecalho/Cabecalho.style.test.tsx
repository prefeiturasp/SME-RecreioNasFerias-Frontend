import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeaderContainer } from './style'

describe('Cabecalho styles', () => {
  it('renderiza HeaderContainer', () => {
    render(
      <HeaderContainer>
        <p>Cabeçalho</p>
      </HeaderContainer>,
    )

    expect(screen.getByText(/cabeçalho/i)).toBeInTheDocument()
  })
})
