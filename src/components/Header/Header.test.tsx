import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAuthSession, setAuthSession } from '../../services/auth'
import { Header } from './index'

vi.mock('../../assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

const sessaoExemplo = {
  token: 'eyJ-token',
  rf: '8080640',
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza campos vazios quando não há sessão', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText(/^RF:\s*$/i)).toBeInTheDocument()
    const cartao = screen.getByText(/^RF:\s*$/i).parentElement
    expect(cartao?.querySelectorAll('p')).toHaveLength(3)
  })

  it('renderiza logo, dados do usuário da sessão e botão de sair', () => {
    setAuthSession(sessaoExemplo)

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('img', { name: /logo recreio nas férias/i })).toBeInTheDocument()
    expect(screen.getByText(/rf:\s*8080640/i)).toBeInTheDocument()
    expect(screen.getByText(/vania ferreira da silva caneki/i)).toBeInTheDocument()
    expect(screen.getByText(/assistente tecnico de educacao i/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('renderiza o ícone de energia dentro do botão sair', () => {
    setAuthSession(sessaoExemplo)

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const botaoSair = screen.getByRole('button', { name: /sair/i })
    const icones = botaoSair.querySelectorAll('svg')

    expect(icones.length).toBeGreaterThan(0)
  })

  it('remove sessão e redireciona para login ao sair', async () => {
    const user = userEvent.setup()
    setAuthSession(sessaoExemplo)

    render(
      <MemoryRouter initialEntries={['/main']}>
        <Routes>
          <Route path="/" element={<div>Tela de login</div>} />
          <Route path="/main" element={<Header />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sair/i }))

    expect(getAuthSession()).toBeNull()
    expect(screen.getByText(/tela de login/i)).toBeInTheDocument()
  })
})
