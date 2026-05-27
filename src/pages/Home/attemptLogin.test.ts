import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAuthSession } from '../../services/auth'
import { attemptLogin, LoginAccessDeniedError } from './attemptLogin'

const respostaLoginExemplo = {
  rf: '8080640',
  cpf: '22712612876',
  email: 'vania.montefusco@sme.prefeitura.sp.gov.br',
  cargos: [
    {
      codigoCargo: 2640,
      descricaoCargo: 'ASSISTENTE TECNICO DE EDUCACAO I',
      codigoUnidade: '121000',
      descricaoUnidade: 'COORDENADORIA DOS CENTROS EDUCACIONAIS UNIFICADOS - COCEU',
      codigoDre: '121000',
      contratoExterno: false,
    },
  ],
  nome: 'VANIA FERREIRA DA SILVA CANEKI',
  inexistenteEol: false,
  token: 'eyJ-token-exemplo',
}

describe('attemptLogin', () => {
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
      attemptLogin({ usuario: 'usuario.teste', senha: 'senha-segura' }),
    ).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: 'usuario.teste', senha: 'senha-segura' }),
    })
    expect(getAuthSession()).toEqual({
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
      attemptLogin({ usuario: 'usuario.teste', senha: 'senha-segura' }),
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

  it('lança LoginAccessDeniedError quando status é 403', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    )

    await expect(
      attemptLogin({ usuario: 'maria', senha: 'senha-invalida' }),
    ).rejects.toEqual(new LoginAccessDeniedError('maria'))
  })

  it('lança LoginFailedError com mensagem vazia quando corpo da resposta está vazio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => '',
      }),
    )

    await expect(
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'LoginFailedError',
      userMessage: '',
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
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'LoginFailedError',
      userMessage: 'The read operation timed out',
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
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      userMessage: 'Credenciais inválidas',
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
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      userMessage: JSON.stringify({ mensagem: 'Payload inválido' }),
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
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      userMessage: '{invalido',
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
      attemptLogin({ usuario: 'joao', senha: '123' }),
    ).rejects.toMatchObject({
      userMessage: 'Bad Gateway',
    })
  })

  it('lança LoginFailedError quando resposta ok não contém dados obrigatórios', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ user: 'maria' }),
      }),
    )

    await expect(
      attemptLogin({ usuario: 'maria', senha: '123' }),
    ).rejects.toMatchObject({
      name: 'LoginFailedError',
      userMessage: 'Resposta de login inválida.',
    })
  })
})
