import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '../../services/autenticacao'
import { VerificadorSessaoAutenticacao } from './index'

const { verificarSessaoAtivaMock } = vi.hoisted(() => ({
  verificarSessaoAtivaMock: vi.fn(),
}))

vi.mock(
  '../../services/autenticacao/verificarSessaoAtiva',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('../../services/autenticacao/verificarSessaoAtiva')
      >()

    return {
      ...actual,
      verificarSessaoAtiva: verificarSessaoAtivaMock,
    }
  },
)

describe('VerificadorSessaoAutenticacao', () => {
  beforeEach(() => {
    localStorage.clear()
    verificarSessaoAtivaMock.mockReset()
    verificarSessaoAtivaMock.mockResolvedValue(true)
  })

  it('não verifica sessão na página de login', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <VerificadorSessaoAutenticacao />
        <Routes>
          <Route path="/" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(verificarSessaoAtivaMock).not.toHaveBeenCalled()
    })
  })

  it('não verifica sessão na listagem de edições', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    render(
      <MemoryRouter initialEntries={['/edicoes-programa']}>
        <VerificadorSessaoAutenticacao />
        <Routes>
          <Route path="/edicoes-programa" element={<p>Edições</p>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(verificarSessaoAtivaMock).not.toHaveBeenCalled()
    })
  })

  it('verifica sessão ao acessar rota protegida', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <VerificadorSessaoAutenticacao />
        <Routes>
          <Route path="/inicio" element={<p>Início</p>} />
          <Route path="/" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(verificarSessaoAtivaMock).toHaveBeenCalled()
    })
  })

  it('redireciona para login quando a sessão não é mais válida', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })
    verificarSessaoAtivaMock.mockResolvedValue(false)

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <VerificadorSessaoAutenticacao />
        <Routes>
          <Route path="/inicio" element={<p>Início</p>} />
          <Route path="/" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(verificarSessaoAtivaMock).toHaveBeenCalled()
    })
  })

  it('redireciona para login quando uma requisição autenticada retorna 401', async () => {
    const { notificarSessaoInvalida } =
      await import('../../services/autenticacao/sessaoInvalida')

    definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <VerificadorSessaoAutenticacao />
        <Routes>
          <Route path="/inicio" element={<p>Início</p>} />
          <Route path="/" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )

    notificarSessaoInvalida()

    await waitFor(() => {
      expect(obterSessaoAutenticacao()).toBeNull()
    })
  })
})
