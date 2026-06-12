import { beforeEach, describe, expect, it, vi } from 'vitest'
import { obterSessaoAutenticacao } from '../../services/autenticacao'
import { ErroAcessoNegadoLogin, tentarLogin } from './tentarLogin'

const respostaLoginExemplo = {
  rf: '8080640',
  cpf: '22712612876',
  email: 'vania.montefusco@sme.prefeitura.sp.gov.br',
  cargos: [
    {
      codigoCargo: 2640,
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
      codigoUnidade: '121000',
      descricaoUnidade:
        'COORDENADORIA DOS CENTROS EDUCACIONAIS UNIFICADOS - COCEU',
      codigoDre: '121000',
      contratoExterno: false,
    },
  ],
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('tentarLogin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia requisição de login com payload esperado e persiste sessão', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaLoginExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      tentarLogin({ usuario: 'usuario.teste', senha: 'senha-segura' }),
    ).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: 'usuario.teste', senha: 'senha-segura' }),
    })
    expect(obterSessaoAutenticacao()).toEqual({
      token: 'eyJ-token-exemplo',
      rf: '8080640',
      nome: 'VANIA FERREIRA DA SILVA CANEKI',
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
    })
  })

  it('usa VITE_API_BASE_URL quando configurado', async () => {
    const originalBaseUrl = import.meta.env.VITE_API_BASE_URL
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => respostaLoginExemplo,
    })
    vi.stubGlobal('fetch', fetchMock)
    import.meta.env.VITE_API_BASE_URL = 'https://api.exemplo.com/'

    await expect(
      tentarLogin({ usuario: 'usuario.teste', senha: 'senha-segura' }),
    ).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.exemplo.com/api/auth/login/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'usuario.teste', senha: 'senha-segura' }),
      },
    )

    import.meta.env.VITE_API_BASE_URL = originalBaseUrl
  })

  it('lança ErroAcessoNegadoLogin quando status é 403', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    )

    await expect(
      tentarLogin({ usuario: 'maria', senha: 'senha-invalida' }),
    ).rejects.toEqual(new ErroAcessoNegadoLogin('maria'))
  })

  it('lança ErroFalhaLogin com mensagem vazia quando corpo da resposta está vazio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => '',
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: '',
    })
  })

  it('repassa a mensagem do backend sem alteração', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () =>
          JSON.stringify({ error: 'The read operation timed out' }),
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'The read operation timed out',
    })
  })

  it('extrai mensagem do campo detail em erro da API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ detail: 'Credenciais inválidas' }),
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Credenciais inválidas',
    })
  })

  it('retorna corpo bruto quando JSON de erro não tem error nem detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ mensagem: 'Payload inválido' }),
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: JSON.stringify({ mensagem: 'Payload inválido' }),
    })
  })

  it('retorna texto bruto quando corpo de erro é JSON inválido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => '{invalido',
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: '{invalido',
    })
  })

  it('retorna texto bruto quando corpo de erro não é JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        text: async () => 'Bad Gateway',
      }),
    )

    await expect(
      tentarLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      mensagemUsuario: 'Bad Gateway',
    })
  })

  it('lança ErroFalhaLogin quando resposta ok não contém dados obrigatórios', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: 'maria' }),
      }),
    )

    await expect(
      tentarLogin({ usuario: 'maria', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'ErroFalhaLogin',
      mensagemUsuario: 'Resposta de login inválida.',
    })
  })
})
