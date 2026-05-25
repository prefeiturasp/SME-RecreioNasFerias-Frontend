import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading, Main } from './style'

describe('Inscricao styles', () => {
  it('renderiza Main e Heading', () => {
    render(
      <Main>
        <Heading>Inscrição</Heading>
      </Main>,
    )

    expect(
      screen.getByRole('heading', { name: 'Inscrição' }),
    ).toBeInTheDocument()
  })
})
