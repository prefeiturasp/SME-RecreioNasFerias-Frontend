import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AreaConteudo, ContainerPaginaInicial } from './style'

describe('PaginaInicial styles', () => {
  it('renderiza ContainerPaginaInicial e AreaConteudo', () => {
    render(
      <ContainerPaginaInicial>
        <AreaConteudo>
          <p>Área principal</p>
        </AreaConteudo>
      </ContainerPaginaInicial>,
    )

    expect(screen.getByText(/área principal/i)).toBeInTheDocument()
  })
})
