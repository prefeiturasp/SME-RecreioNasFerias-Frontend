import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PaginaLogin from './index'

vi.mock('@/assets/background-home.jpg', () => ({
  default: 'background-home-stub.jpg',
}))

vi.mock('@/assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

vi.mock('@/assets/logo-sme.png', () => ({
  default: 'logo-sme-stub.png',
}))

vi.mock('@/components/login/LoginForm', () => ({
  LoginForm: () => <form aria-label="formulário de login" />,
}))

describe('PaginaLogin', () => {
  it('renderiza a saudação e a identificação do sistema', () => {
    render(<PaginaLogin />)

    expect(screen.getByText('Bem-vindo(a) ao')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /sistema de gestão.*do recreio nas férias/i,
      }),
    ).toBeInTheDocument()
  })

  it('renderiza o banner e os logotipos com textos alternativos', () => {
    render(<PaginaLogin />)

    expect(screen.getByAltText('Banner do login')).toHaveAttribute(
      'src',
      'background-home-stub.jpg',
    )
    expect(screen.getByAltText('Logo Recreio')).toHaveAttribute(
      'src',
      'logo-recreio-stub.png',
    )
    expect(screen.getByAltText('Logo Prefeitura')).toHaveAttribute(
      'src',
      'logo-sme-stub.png',
    )
  })

  it('renderiza o formulário de login', () => {
    render(<PaginaLogin />)

    expect(
      screen.getByRole('form', { name: 'formulário de login' }),
    ).toBeInTheDocument()
  })

  it('organiza a página em uma área de banner e outra de acesso', () => {
    const { container } = render(<PaginaLogin />)
    const pagina = container.firstElementChild

    expect(pagina).toHaveClass('min-h-screen')
    expect(pagina).toHaveClass('md:flex-row')
    expect(pagina?.children).toHaveLength(2)
    expect(pagina?.children[0]).toHaveClass('md:w-[60%]')
    expect(pagina?.children[1]).toHaveClass('md:w-[40%]')
  })
})
