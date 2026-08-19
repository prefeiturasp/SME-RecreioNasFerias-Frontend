import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ErroAcessoNegadoLogin,
  ErroFalhaLogin,
} from '@/services/autenticacao/login'
import { LoginForm } from './index'

const { loginMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
}))

vi.mock('@/services/autenticacao/login', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/autenticacao/login')>()

  return {
    ...actual,
    login: loginMock,
  }
})

function renderLoginForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/inicio" element={<p>Área inicial</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    loginMock.mockReset()
    loginMock.mockResolvedValue(undefined)
  })

  it('renderiza os campos, o botão de acesso e o link de recuperação', () => {
    renderLoginForm()

    expect(screen.getByLabelText('Usuário')).toHaveAttribute(
      'autocomplete',
      'username',
    )
    expect(screen.getByLabelText('Senha')).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
    expect(screen.getByRole('button', { name: 'Acessar' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Esqueci minha senha' }),
    ).toHaveAttribute('href', '#recuperar-senha')
  })

  it('exibe erros de validação quando os campos estão vazios', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    expect(await screen.findByText('Usuário é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('Senha é obrigatória')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('valida o tamanho mínimo da senha antes de chamar a API', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), '12345')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    expect(
      await screen.findByText('Senha deve ter pelo menos 6 caracteres'),
    ).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('envia credenciais válidas e navega após o sucesso', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        {
          usuario: 'Maria',
          senha: 'senha-segura',
        },
        expect.objectContaining({
          client: expect.any(QueryClient),
        }),
      )
    })
    expect(await screen.findByText('Área inicial')).toBeInTheDocument()
  })

  it('indica carregamento e bloqueia novo envio enquanto aguarda', async () => {
    const user = userEvent.setup()
    let resolver!: () => void
    loginMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolver = resolve
        }),
    )

    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    const botao = screen.getByRole('button', { name: 'Acessando...' })
    expect(botao).toBeDisabled()

    resolver()
    await screen.findByText('Área inicial')
  })

  it('exibe a mensagem de acesso negado', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(new ErroAcessoNegadoLogin('Maria'))
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Olá Maria!')
  })

  it('exibe a mensagem segura de falha de login', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(new ErroFalhaLogin('Falha temporária'))
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Falha temporária',
    )
  })

  it('usa uma mensagem genérica para erro desconhecido', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(new Error('erro técnico'))
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível realizar o login. Tente novamente.',
    )
  })

  it('remove a mensagem de erro quando o usuário edita um campo', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(new ErroFalhaLogin('Falha temporária'))
    renderLoginForm()

    await user.type(screen.getByLabelText('Usuário'), 'Maria')
    await user.type(screen.getByLabelText('Senha'), 'senha-segura')
    await user.click(screen.getByRole('button', { name: 'Acessar' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Usuário'), 'a')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
