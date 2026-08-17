import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
} from '../../services/autenticacao'
import { RotaProtegida } from './index'

const { restaurarSessaoAutenticacaoMock } = vi.hoisted(() => ({
  restaurarSessaoAutenticacaoMock: vi.fn(),
}))

vi.mock('../../services/autenticacao', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/autenticacao')>()

  return {
    ...actual,
    restaurarSessaoAutenticacao: restaurarSessaoAutenticacaoMock,
  }
})

describe('RotaProtegida', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    restaurarSessaoAutenticacaoMock.mockReset()
    restaurarSessaoAutenticacaoMock.mockResolvedValue(undefined)
  })

  it('redireciona para login quando não autenticado', async () => {
    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route
            path="/inicio"
            element={
              <RotaProtegida>
                <p>Área restrita</p>
              </RotaProtegida>
            }
          />
          <Route path="/" element={<p>Tela de login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText(/tela de login/i)).toBeInTheDocument()
    expect(screen.queryByText(/área restrita/i)).not.toBeInTheDocument()
    expect(restaurarSessaoAutenticacaoMock).toHaveBeenCalled()
  })

  it('renderiza conteúdo quando autenticado', () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
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
