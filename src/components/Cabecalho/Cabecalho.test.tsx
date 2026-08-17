import { axiosPostMock } from '../../services/api/mocks'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '../../services/autenticacao'
import { Cabecalho } from './index'

vi.mock('../../assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

const sessaoExemplo = {
  token: 'eyJ-token',
  rf: '1234567',
  nome: 'USUARIO TESTE',
  descricaoCargo: 'CARGO TESTE',
}

describe('Cabecalho', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('renderiza campos vazios quando não há sessão', () => {
    render(
      <MemoryRouter>
        <Cabecalho />
      </MemoryRouter>,
    )

    expect(screen.getByText(/^RF:\s*$/i)).toBeInTheDocument()
    const cartao = screen.getByText(/^RF:\s*$/i).parentElement
    expect(cartao?.querySelectorAll('p')).toHaveLength(3)
  })

  it('renderiza logo, dados do usuário da sessão e botão de sair', () => {
    definirSessaoAutenticacao(sessaoExemplo)

    render(
      <MemoryRouter>
        <Cabecalho />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/rf:\s*1234567/i)).toBeInTheDocument()
    expect(screen.getByText(/usuario teste/i)).toBeInTheDocument()
    expect(screen.getByText(/cargo teste/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('renderiza o ícone de energia dentro do botão sair', () => {
    definirSessaoAutenticacao(sessaoExemplo)

    render(
      <MemoryRouter>
        <Cabecalho />
      </MemoryRouter>,
    )

    const botaoSair = screen.getByRole('button', { name: /sair/i })
    const icones = botaoSair.querySelectorAll('svg')

    expect(icones.length).toBeGreaterThan(0)
  })

  it('navega para /inicio ao clicar na logo', async () => {
    const user = userEvent.setup()
    definirSessaoAutenticacao(sessaoExemplo)

    render(
      <MemoryRouter initialEntries={['/edicoes-programa']}>
        <Routes>
          <Route path="/edicoes-programa" element={<Cabecalho />} />
          <Route path="/inicio" element={<div>Página inicial</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /voltar ao início/i }))

    expect(screen.getByText(/página inicial/i)).toBeInTheDocument()
  })

  it('chama logout no backend, remove sessão e redireciona para login ao sair', async () => {
    const user = userEvent.setup()
    definirSessaoAutenticacao(sessaoExemplo)

    axiosPostMock.mockResolvedValue({ status: 204 })

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route path="/" element={<div>Tela de login</div>} />
          <Route path="/inicio" element={<Cabecalho />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sair/i }))

    await waitFor(() => {
      expect(obterSessaoAutenticacao()).toBeNull()
    })
    expect(axiosPostMock).toHaveBeenCalledWith('/api/v1/auth/logout/', null, {
      withCredentials: true,
    })
    expect(screen.getByText(/tela de login/i)).toBeInTheDocument()
  })

  it('remove a sessão local mesmo quando o logout no backend falha', async () => {
    const user = userEvent.setup()
    definirSessaoAutenticacao(sessaoExemplo)

    axiosPostMock.mockRejectedValue(new Error('network error'))

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route path="/" element={<div>Tela de login</div>} />
          <Route path="/inicio" element={<Cabecalho />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sair/i }))

    await waitFor(() => {
      expect(obterSessaoAutenticacao()).toBeNull()
    })
    expect(screen.getByText(/tela de login/i)).toBeInTheDocument()
  })
})
