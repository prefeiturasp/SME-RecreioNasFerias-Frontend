import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../api/http'
import { ErroListagemPolosParceiros, listarPolosParceiros } from './api'

vi.mock('../api/http', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

const apiGetMock = vi.mocked(api.get)

const respostaListagemExemplo = {
  results: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      tipo: 'Pendente',
      nomeOsc: 'Cantinho Feliz',
      nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
      dre: 'DRE Butantã',
      tipoUe: 'CEI',
      quantidadeMaximaAlunos: 50,
      cep: '05510-000',
      endereco: 'Rua Exemplo, 100',
      nomeGestor: 'Maria Silva',
      emailPolo: 'polo@exemplo.com',
      telefonePolo: '11999999999',
      status: 'ativo',
      observacoesGerais: '',
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
  totalPages: 1,
}

describe('listarPolosParceiros', () => {
  beforeEach(() => {
    apiGetMock.mockReset()
  })

  it('envia requisição autenticada e mapeia a resposta da API', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

    await expect(listarPolosParceiros()).resolves.toEqual({
      polos: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          dre: 'DRE Butantã',
          tipoUe: 'CEI',
          nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
          nomeOsc: 'Cantinho Feliz',
        },
      ],
      pagina: 1,
      tamanhoPagina: 10,
      total: 1,
      totalPaginas: 1,
    })

    expect(apiGetMock).toHaveBeenCalledTimes(1)
    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: { page: '1', pageSize: '10', gestao: 'Parceira' },
    })
  })

  it('envia parâmetros de paginação e filtros customizados', async () => {
    apiGetMock.mockResolvedValue({ data: respostaListagemExemplo })

    await listarPolosParceiros({
      pagina: 2,
      tamanhoPagina: 20,
      dre: 'DRE Butantã',
      tipoUe: 'CEI',
      nomePoloOuOsc: 'Centro',
    })

    expect(apiGetMock).toHaveBeenCalledWith('/api/polos/', {
      params: {
        page: '2',
        pageSize: '20',
        gestao: 'Parceira',
        dre: 'DRE Butantã',
        tipoUe: 'CEI',
        nomePoloOuOsc: 'Centro',
      },
    })
  })

  it('lança erro quando a API retorna falha', async () => {
    apiGetMock.mockRejectedValue({
      response: {
        status: 401,
        data: { detail: 'Credenciais inválidas.' },
      },
    })

    await expect(listarPolosParceiros()).rejects.toBeInstanceOf(
      ErroListagemPolosParceiros,
    )
    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas.',
    })
  })

  it('lança erro quando a resposta de listagem é inválida', async () => {
    apiGetMock.mockResolvedValue({ data: { results: 'invalido' } })

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Resposta de listagem inválida.',
    })
  })

  it('usa o texto bruto quando o corpo de erro é uma string', async () => {
    apiGetMock.mockRejectedValue({
      response: { status: 500, data: 'Erro interno do servidor' },
    })

    await expect(listarPolosParceiros()).rejects.toMatchObject({
      mensagemUsuario: 'Erro interno do servidor',
    })
  })
})
