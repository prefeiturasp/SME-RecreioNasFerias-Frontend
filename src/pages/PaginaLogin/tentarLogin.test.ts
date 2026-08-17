import { axiosPostMock } from '../../services/api/mocks'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  limparSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '../../services/autenticacao'
import { ErroAcessoNegadoLogin, tentarLogin } from './tentarLogin'

const respostaLoginExemplo = {
  rf: '1234567',
  cpf: '11122233344',
  email: 'usuario.teste@sme.prefeitura.sp.gov.br',
  cargos: [
    {
      codigoCargo: 1234,
      descricaoCargo: 'CARGO TESTE',
      codigoUnidade: '000123',
      descricaoUnidade: 'UNIDADE DE TESTE',
      codigoDre: '000123',
      contratoExterno: false,
    },
  ],
  nome: 'USUARIO TESTE',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('tentarLogin', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    axiosPostMock.mockReset()
  })

  it('envia requisição de login com payload esperado e persiste sessão', async () => {
    axiosPostMock.mockResolvedValue({ data: respostaLoginExemplo })

    await expect(
      tentarLogin({ usuario: 'usuario.teste', senha: 'senha-segura' }),
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

  it('lança ErroAcessoNegadoLogin quando status é 403', async () => {
    axiosPostMock.mockRejectedValue({ response: { status: 403 } })

    await expect(
      tentarLogin({ usuario: 'maria', senha: 'senha-invalida' }),
    ).rejects.toEqual(new ErroAcessoNegadoLogin('maria'))
  })

  it('extrai mensagem do campo detalhe em erro da API', async () => {
    axiosPostMock.mockRejectedValue({
      response: { status: 401, data: { detalhe: 'Credenciais inválidas' } },
    })

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas',
    })
  })

  it('extrai mensagem do campo detail em erro da API', async () => {
    axiosPostMock.mockRejectedValue({
      response: { status: 401, data: { detail: 'Credenciais inválidas' } },
    })

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas',
    })
  })

  it('repassa a mensagem do campo error do backend', async () => {
    axiosPostMock.mockRejectedValue({
      response: {
        status: 500,
        data: { error: 'The read operation timed out' },
      },
    })

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'The read operation timed out',
    })
  })

  it('usa mensagem vazia quando o corpo de erro não tem chave reconhecida', async () => {
    axiosPostMock.mockRejectedValue({
      response: { status: 400, data: { mensagem: 'Payload inválido' } },
    })

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: '',
    })
  })

  it('repassa o texto bruto quando o corpo de erro é uma string', async () => {
    axiosPostMock.mockRejectedValue({
      response: { status: 502, data: 'Bad Gateway' },
    })

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Bad Gateway',
    })
  })

  it('usa mensagem vazia quando não há resposta da API', async () => {
    axiosPostMock.mockRejectedValue(new Error('network error'))

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: '',
    })
  })

  it('lança ErroFalhaLogin quando resposta ok não contém dados obrigatórios', async () => {
    axiosPostMock.mockResolvedValue({ data: { user: 'maria' } })

    await expect(
      tentarLogin({ usuario: 'maria', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'Resposta de login inválida.',
    })
  })
})
