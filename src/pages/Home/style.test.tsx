import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading, Main } from './style'

describe('Home styles', () => {
  it('renderiza Main e Heading', () => {
    render(
      <Main>
        <Heading>Bem-vindo</Heading>
      </Main>,
    )

    expect(
      screen.getByRole('heading', { name: 'Bem-vindo' }),
    ).toBeInTheDocument()
  })
})
