import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroAcessoNegadoLogin, ErroFalhaLogin } from './tentarLogin'
import PaginaLogin from './index'
import { construirMensagemAcessoNegado } from './messages'

vi.mock('../../assets/logo-recreio.png', () => ({
  default: 'logo-recreio-stub.png',
}))

vi.mock('../../assets/logo-sme.png', () => ({
  default: 'logo-sme-stub.png',
}))

vi.mock('../../assets/background-home.jpg', () => ({
  default: 'background-home-stub.jpg',
}))

const { tentarLoginMock } = vi.hoisted(() => ({
  tentarLoginMock: vi.fn(),
}))

const { navegarMock } = vi.hoisted(() => ({
  navegarMock: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()

  return {
    ...actual,
    useNavigate: () => navegarMock,
  }
})

vi.mock('./tentarLogin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./tentarLogin')>()

  return {
    ...actual,
    tentarLogin: tentarLoginMock,
  }
})

describe('construirMensagemAcessoNegado', () => {
  it('inclui o nome do usuário na mensagem', () => {
    expect(construirMensagemAcessoNegado('Maria')).toContain('Olá Maria!')
  })

  it('usa fallback quando o nome está vazio', () => {
    expect(construirMensagemAcessoNegado('   ')).toContain('Olá usuário!')
  })
})

describe('PaginaLogin', () => {
  beforeEach(() => {
    tentarLoginMock.mockReset()
    tentarLoginMock.mockResolvedValue(undefined)
    navegarMock.mockReset()
  })

  it('renderiza a mensagem de boas-vindas', () => {
    render(<PaginaLogin />)

    expect(screen.getByText(/bem-vindo\(a\) ao/i)).toBeInTheDocument()
  })

  it('renderiza o título do sistema', () => {
    render(<PaginaLogin />)

    expect(screen.getByText(/sistema de gestão/i)).toBeInTheDocument()
    expect(screen.getByText(/do recreio nas férias/i)).toBeInTheDocument()
  })

  it('renderiza os logos com textos alternativos', () => {
    render(<PaginaLogin />)

    expect(screen.getByAltText(/recreio nas férias/i)).toBeInTheDocument()
    expect(
      screen.getByAltText(
        /prefeitura de são paulo - secretaria municipal de educação/i,
      ),
    ).toBeInTheDocument()
  })

  it('renderiza o formulário de acesso', () => {
    render(<PaginaLogin />)

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /acessar/i })).toBeInTheDocument()
  })

  it('não exibe mensagem de erro antes da tentativa de login', () => {
    render(<PaginaLogin />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o login retorna acesso negado', async () => {
    const user = userEvent.setup()
    tentarLoginMock.mockRejectedValueOnce(new ErroAcessoNegadoLogin('João'))

    render(<PaginaLogin />)

    await user.type(screen.getByLabelText(/usuário/i), 'João')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /acessar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/olá joão!/i)
    })
  })

  it('oculta a mensagem de erro ao editar os campos', async () => {
    const user = userEvent.setup()
    tentarLoginMock.mockRejectedValueOnce(new ErroAcessoNegadoLogin('João'))

    render(<PaginaLogin />)

    await user.type(screen.getByLabelText(/usuário/i), 'João')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /acessar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/usuário/i), 'a')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('exibe alerta com a mensagem retornada pelo backend', async () => {
    const user = userEvent.setup()
    tentarLoginMock.mockRejectedValueOnce(
      new ErroFalhaLogin('The read operation timed out'),
    )

    render(<PaginaLogin />)

    await user.type(screen.getByLabelText(/usuário/i), 'Maria')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /acessar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'The read operation timed out',
      )
    })
  })

  it('associa labels aos inputs corretamente', () => {
    render(<PaginaLogin />)

    expect(screen.getByLabelText(/usuário/i)).toHaveAttribute('id', 'usuario')
    expect(screen.getByLabelText(/senha/i)).toHaveAttribute('id', 'senha')
  })

  it('define autocomplete nos campos de login', () => {
    render(<PaginaLogin />)

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
    render(<PaginaLogin />)

    const link = screen.getByRole('link', { name: /esqueci minha senha/i })

    expect(link).toHaveAttribute('href', '#recuperar-senha')
  })

  it('marca a seção de imagem como decorativa', () => {
    const { container } = render(<PaginaLogin />)

    expect(
      container.querySelector('section[aria-hidden="true"]'),
    ).toBeInTheDocument()
  })

  it('não exibe alerta quando ocorre erro desconhecido no login', async () => {
    const user = userEvent.setup()
    tentarLoginMock.mockRejectedValueOnce(new Error('erro inesperado'))

    render(<PaginaLogin />)

    await user.type(screen.getByLabelText(/usuário/i), 'Maria')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /acessar/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('redireciona para /inicio quando o login é bem-sucedido', async () => {
    const user = userEvent.setup()
    tentarLoginMock.mockResolvedValueOnce(undefined)

    render(<PaginaLogin />)

    await user.type(screen.getByLabelText(/usuário/i), 'Maria')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /acessar/i }))

    await waitFor(() => {
      expect(navegarMock).toHaveBeenCalledWith('/inicio')
    })
  })
})
