import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContainerPaginaLogin, Heading } from './style'

describe('PaginaLogin styles', () => {
  it('renderiza ContainerPaginaLogin e Heading', () => {
    render(
      <ContainerPaginaLogin>
        <Heading>Bem-vindo</Heading>
      </ContainerPaginaLogin>,
    )

    expect(
      screen.getByRole('heading', { name: 'Bem-vindo' }),
    ).toBeInTheDocument()
  })
})
