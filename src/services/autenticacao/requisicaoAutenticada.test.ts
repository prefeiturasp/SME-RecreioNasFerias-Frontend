import { beforeEach, describe, expect, it, vi } from 'vitest'
import { definirSessaoAutenticacao, obterSessaoAutenticacao } from './storage'
import { requisicaoAutenticada } from './requisicaoAutenticada'

describe('requisicaoAutenticada', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envia requisição com token Bearer', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({ status: 200, ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await requisicaoAutenticada('/api/edicoes/', { method: 'GET' })

    expect(fetchMock).toHaveBeenCalledWith('/api/edicoes/', {
      method: 'GET',
      headers: new Headers({ Authorization: 'Bearer eyJ-token' }),
    })
  })

  it('deduplica requisições GET simultâneas para o mesmo endpoint', async () => {
    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      clone: function clone() {
        return this
      },
    })
    vi.stubGlobal('fetch', fetchMock)

    await Promise.all([
      requisicaoAutenticada('/api/edicoes/', { method: 'GET' }),
      requisicaoAutenticada('/api/edicoes/', { method: 'GET' }),
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('desloga automaticamente quando a API retorna 401', async () => {
    const ouvinte = vi.fn()

    definirSessaoAutenticacao({
      token: 'eyJ-token-expirado',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const { registrarOuvinteSessaoInvalida } = await import('./sessaoInvalida')
    registrarOuvinteSessaoInvalida(ouvinte)

    const fetchMock = vi.fn().mockResolvedValue({ status: 401, ok: false })
    vi.stubGlobal('fetch', fetchMock)

    await requisicaoAutenticada('/api/edicoes/', { method: 'GET' })

    expect(obterSessaoAutenticacao()).toBeNull()
    expect(ouvinte).toHaveBeenCalledTimes(1)
  })
})
