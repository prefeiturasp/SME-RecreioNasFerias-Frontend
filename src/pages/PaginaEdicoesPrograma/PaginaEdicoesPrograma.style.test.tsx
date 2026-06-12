import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AreaConteudo, ContainerPaginaEdicoesPrograma } from './style'

describe('PaginaEdicoesPrograma styles', () => {
  it('renderiza ContainerPaginaEdicoesPrograma e AreaConteudo', () => {
    render(
      <ContainerPaginaEdicoesPrograma>
        <AreaConteudo>
          <p>Área principal</p>
        </AreaConteudo>
      </ContainerPaginaEdicoesPrograma>,
    )

    expect(screen.getByText(/área principal/i)).toBeInTheDocument()
  })
})
