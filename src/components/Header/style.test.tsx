import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Links, Nav, Title } from './style'

describe('Header styles', () => {
  it('renderiza Nav, Title e Links', () => {
    render(
      <MemoryRouter>
        <Nav>
          <Title>Recreio nas Férias</Title>
          <Links>
            <a href="/">Início</a>
          </Links>
        </Nav>
      </MemoryRouter>,
    )

    expect(screen.getByText('Recreio nas Férias')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
  })
})
