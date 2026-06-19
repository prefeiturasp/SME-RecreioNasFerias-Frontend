import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { definirSessaoAutenticacao } from '../../services/autenticacao'
import { RotaProtegida } from './index'

describe('RotaProtegida', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redireciona para login quando não autenticado', () => {
    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <RotaProtegida>
          <p>Área restrita</p>
        </RotaProtegida>
      </MemoryRouter>,
    )

    expect(screen.queryByText(/área restrita/i)).not.toBeInTheDocument()
  })

  it('renderiza conteúdo quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA',
      descricaoCargo: 'CARGO',
    })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <RotaProtegida>
          <p>Área restrita</p>
        </RotaProtegida>
      </MemoryRouter>,
    )

    expect(screen.getByText(/área restrita/i)).toBeInTheDocument()
  })
})
