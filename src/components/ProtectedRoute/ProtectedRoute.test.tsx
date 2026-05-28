import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAuthSession } from '../../services/auth'
import { ProtectedRoute } from './index'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redireciona para login quando não autenticado', () => {
    render(
      <MemoryRouter initialEntries={['/main']}>
        <ProtectedRoute>
          <p>Área restrita</p>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.queryByText(/área restrita/i)).not.toBeInTheDocument()
  })

  it('renderiza conteúdo quando autenticado', () => {
    setAuthSession({
      token: 'eyJ-token',
      rf: '8080640',
      nome: 'VANIA',
      descricaoCargo: 'CARGO',
    })

    render(
      <MemoryRouter initialEntries={['/main']}>
        <ProtectedRoute>
          <p>Área restrita</p>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText(/área restrita/i)).toBeInTheDocument()
  })
})
