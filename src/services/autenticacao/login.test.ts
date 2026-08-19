import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
} from './storage'
import { ErroAcessoNegadoLogin, ErroFalhaLogin, login } from './login'

const { axiosPostMock } = vi.hoisted(() => ({
  axiosPostMock: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    post: axiosPostMock,
    isAxiosError: (error: unknown) =>
      Boolean(
        error &&
        typeof error === 'object' &&
        (error as { isAxiosError?: unknown }).isAxiosError === true,
      ),
  },
}))

const respostaLoginValida = {
  rf: '1234567',
  nome: 'USUARIO TESTE',
  cargos: [
    {
      descricaoCargo: 'CARGO TESTE',
    },
  ],
  token: 'eyJ-token-exemplo',
}

describe('login', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    axiosPostMock.mockReset()
  })

  it('envia as credenciais e persiste a sessão após uma resposta válida', async () => {
    axiosPostMock.mockResolvedValue({ data: respostaLoginValida })

    await expect(
      login({ usuario: 'usuario.teste', senha: 'senha-segura' }),
    ).resolves.toBeUndefined()

    expect(axiosPostMock).toHaveBeenCalledWith(
      '/api/v1/auth/login/',
      { login: 'usuario.teste', senha: 'senha-segura' },
      { withCredentials: true },
    )
    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
  })

  it('não altera uma sessão existente quando a resposta é inválida', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token-anterior',
      rf: '7654321',
      nome: 'USUARIO ANTERIOR',
      descricaoCargo: 'CARGO ANTERIOR',
    })
    axiosPostMock.mockResolvedValue({ data: { token: 'token-sem-perfil' } })

    await expect(
      login({ usuario: 'usuario.teste', senha: 'senha-segura' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'Não foi possível validar a resposta do login.',
    })

    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token-anterior',
      rf: '7654321',
      nome: 'USUARIO ANTERIOR',
      descricaoCargo: 'CARGO ANTERIOR',
    })
  })

  it('lança erro específico quando o backend responde acesso negado', async () => {
    const erro = {
      isAxiosError: true,
      response: { status: 403 },
    }
    axiosPostMock.mockRejectedValue(erro)

    await expect(
      login({ usuario: 'maria', senha: 'senha-invalida' }),
    ).rejects.toEqual(new ErroAcessoNegadoLogin('maria'))
  })

  it('usa uma mensagem segura para falhas da API', async () => {
    const erro = {
      isAxiosError: true,
      response: {
        status: 500,
        data: { error: 'detalhe técnico interno' },
      },
    }
    axiosPostMock.mockRejectedValue(erro)

    await expect(
      login({ usuario: 'maria', senha: 'senha-segura' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'Não foi possível realizar o login. Tente novamente.',
      cause: erro,
    })
  })

  it('usa uma mensagem segura quando ocorre falha de rede', async () => {
    const erro = {
      isAxiosError: true,
      message: 'Network Error',
    }
    axiosPostMock.mockRejectedValue(erro)

    await expect(
      login({ usuario: 'maria', senha: 'senha-segura' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'Não foi possível realizar o login. Tente novamente.',
      cause: erro,
    })
  })

  it('não persiste a sessão quando a API retorna dados incompletos', async () => {
    axiosPostMock.mockResolvedValue({
      data: {
        token: 'eyJ-token',
        rf: '1234567',
        nome: 'USUARIO TESTE',
        cargos: [],
      },
    })

    await expect(
      login({ usuario: 'maria', senha: 'senha-segura' }),
    ).rejects.toBeInstanceOf(ErroFalhaLogin)
    expect(obterSessaoAutenticacao()).toBeNull()
  })
})
