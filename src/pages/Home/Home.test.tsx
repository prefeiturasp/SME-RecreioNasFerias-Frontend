import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Home from './index'

vi.mock('../../assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

vi.mock('../../assets/logo-sme.png', () => ({
  default: 'logo-sme-stub.png',
}))

vi.mock('../../assets/background-home.jpg', () => ({
  default: 'background-home-stub.jpg',
}))

describe('Home', () => {
  it('renderiza a mensagem de boas-vindas', () => {
    render(<Home />)

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
  })

  it('renderiza o título do sistema', () => {
    render(<Home />)

    expect(screen.getByText(/sistema de gestão/i)).toBeInTheDocument()
    expect(screen.getByText(/do recreio nas férias/i)).toBeInTheDocument()
  })

  it('renderiza os logos com textos alternativos', () => {
    render(<Home />)

    expect(screen.getByAltText(/recreio nas férias/i)).toBeInTheDocument()
    expect(
      screen.getByAltText(
        /prefeitura de são paulo - secretaria municipal de educação/i,
      ),
    ).toBeInTheDocument()
  })

  it('renderiza o formulário de acesso', () => {
    render(<Home />)

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /acessar/i })).toBeInTheDocument()
  })

  it('associa labels aos inputs corretamente', () => {
    render(<Home />)

    expect(screen.getByLabelText(/usuário/i)).toHaveAttribute('id', 'usuario')
    expect(screen.getByLabelText(/senha/i)).toHaveAttribute('id', 'senha')
  })

  it('define autocomplete nos campos de login', () => {
    render(<Home />)

    expect(screen.getByLabelText(/usuário/i)).toHaveAttribute(
      'autocomplete',
      'username',
    )
    expect(screen.getByLabelText(/senha/i)).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
  })

  it('renderiza o link de recuperação de senha', () => {
    render(<Home />)

    const link = screen.getByRole('link', { name: /esqueci minha senha/i })

    expect(link).toHaveAttribute('href', '#recuperar-senha')
  })

  it('marca a seção de imagem como decorativa', () => {
    const { container } = render(<Home />)

    expect(
      container.querySelector('section[aria-hidden="true"]'),
    ).toBeInTheDocument()
  })
})
