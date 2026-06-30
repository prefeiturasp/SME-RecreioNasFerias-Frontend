import { beforeEach, describe, expect, it, vi } from 'vitest'
import { definirSessaoAutenticacao, obterSessaoAutenticacao } from './storage'
import {
  MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO,
  notificarSessaoInvalida,
  registrarOuvinteSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'

function criarRespostaComCorpo(
  status: number,
  corpo: string,
): Response {
  return {
    status,
    clone: () =>
      ({
        text: () => Promise.resolve(corpo),
      }) as Response,
  } as Response
}

describe('sessaoInvalida', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('identifica resposta 401 como sessão inválida', async () => {
    await expect(
      respostaIndicaSessaoInvalida({ status: 401 } as Response),
    ).resolves.toBe(true)
  })

  it('identifica 403 com token inválido ou expirado como sessão inválida', async () => {
    await expect(
      respostaIndicaSessaoInvalida(
        criarRespostaComCorpo(
          403,
          JSON.stringify({ detail: MENSAGEM_TOKEN_INVALIDO_OU_EXPIRADO }),
        ),
      ),
    ).resolves.toBe(true)
  })

  it('não identifica 403 com outra mensagem como sessão inválida', async () => {
    await expect(
      respostaIndicaSessaoInvalida(
        criarRespostaComCorpo(
          403,
          JSON.stringify({ detail: 'Acesso negado.' }),
        ),
      ),
    ).resolves.toBe(false)
  })

  it('não identifica respostas de sucesso como sessão inválida', async () => {
    await expect(
      respostaIndicaSessaoInvalida({ status: 200 } as Response),
    ).resolves.toBe(false)
  })

  it('limpa sessão e notifica ouvintes quando a sessão expira', () => {
    const ouvinte = vi.fn()

    definirSessaoAutenticacao({
      token: 'eyJ-token',
      rf: '1234567',
      nome: 'Usuário Teste',
      descricaoCargo: 'Cargo Teste',
    })

    const removerOuvinte = registrarOuvinteSessaoInvalida(ouvinte)
    notificarSessaoInvalida()

    expect(obterSessaoAutenticacao()).toBeNull()
    expect(ouvinte).toHaveBeenCalledTimes(1)

    removerOuvinte()
  })

  it('não notifica quando não há sessão ativa', () => {
    const ouvinte = vi.fn()
    registrarOuvinteSessaoInvalida(ouvinte)

    notificarSessaoInvalida()

    expect(ouvinte).not.toHaveBeenCalled()
  })
})
