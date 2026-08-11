import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '@/services/autenticacao'
import { CabecalhoPagina } from './cabecalho-pagina'

vi.mock('@/assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

const sessaoExemplo = {
  token: 'eyJ-token',
  rf: '8080640',
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
}

describe('CabecalhoPagina', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza campos vazios quando não há sessão', () => {
    render(
      <MemoryRouter>
        <CabecalhoPagina />
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
        <CabecalhoPagina />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: /voltar ao início/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/rf:\s*8080640/i)).toBeInTheDocument()
    expect(
      screen.getByText(/vania ferreira da silva caneki/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/assistente tecnico de educacao i/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('renderiza o ícone de energia dentro do botão sair', () => {
    definirSessaoAutenticacao(sessaoExemplo)

    render(
      <MemoryRouter>
        <CabecalhoPagina />
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
          <Route path="/edicoes-programa" element={<CabecalhoPagina />} />
          <Route path="/inicio" element={<div>Página inicial</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /voltar ao início/i }))

    expect(screen.getByText(/página inicial/i)).toBeInTheDocument()
  })

  it('remove sessão e redireciona para login ao sair', async () => {
    const user = userEvent.setup()
    definirSessaoAutenticacao(sessaoExemplo)

    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route path="/" element={<div>Tela de login</div>} />
          <Route path="/inicio" element={<CabecalhoPagina />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sair/i }))

    expect(obterSessaoAutenticacao()).toBeNull()
    expect(screen.getByText(/tela de login/i)).toBeInTheDocument()
  })
})
