import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContainerMenuLateral, ConteudoMenu } from './style'

describe('MenuLateral styles', () => {
  it('renderiza ContainerMenuLateral e ConteudoMenu', () => {
    render(
      <ContainerMenuLateral $estaAberto>
        <ConteudoMenu>
          <p>Menu</p>
        </ConteudoMenu>
      </ContainerMenuLateral>,
    )

    expect(screen.getByText(/menu/i)).toBeInTheDocument()
  })
})
