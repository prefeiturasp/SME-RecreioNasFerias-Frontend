import { beforeEach, describe, expect, it, vi } from 'vitest'
import { obterDadosUsuarioAutenticado } from './obterDadosUsuarioAutenticado'
import { definirSessaoAutenticacao, limparSessaoAutenticacao } from './storage'

const { apiGetMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
}))

vi.mock('../api/http', () => ({
  api: { get: apiGetMock },
}))

const respostaMeExemplo = {
  rf: '1234567',
  nome: 'USUARIO TESTE',
  email: 'usuario.teste@sme.prefeitura.sp.gov.br',
  cpf: '11122233344',
  cargos: [
    {
      codigoCargo: 1234,
      descricaoCargo: 'CARGO TESTE',
    },
  ],
}

describe('obterDadosUsuarioAutenticado', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
    apiGetMock.mockReset()
  })

  it('busca o perfil no endpoint me com o token em memória', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    apiGetMock.mockResolvedValue({ data: respostaMeExemplo })

    await expect(obterDadosUsuarioAutenticado()).resolves.toEqual({
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO TESTE',
    })
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/auth/me/')
  })

  it('retorna null quando não há token em memória', async () => {
    await expect(obterDadosUsuarioAutenticado()).resolves.toBeNull()
    expect(apiGetMock).not.toHaveBeenCalled()
  })

  it('retorna null quando o backend recusa a requisição', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    apiGetMock.mockRejectedValue({ response: { status: 401 } })

    await expect(obterDadosUsuarioAutenticado()).resolves.toBeNull()
  })

  it('retorna null quando a resposta não possui perfil válido', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    apiGetMock.mockResolvedValue({ data: { rf: '1' } })

    await expect(obterDadosUsuarioAutenticado()).resolves.toBeNull()
  })

  it('retorna null quando ocorre falha de rede', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'USUARIO TESTE',
      descricaoCargo: 'CARGO',
    })
    apiGetMock.mockRejectedValue(new Error('network error'))

    await expect(obterDadosUsuarioAutenticado()).resolves.toBeNull()
  })
})
