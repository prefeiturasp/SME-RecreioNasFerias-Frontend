import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  invalidarCacheVerificacaoSessao,
  marcarSessaoVerificada,
  sessaoVerificadaRecentemente,
} from './cacheVerificacaoSessao'

describe('cacheVerificacaoSessao', () => {
  beforeEach(() => {
    invalidarCacheVerificacaoSessao()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('indica que a sessão foi verificada recentemente após marcar', () => {
    marcarSessaoVerificada()

    expect(sessaoVerificadaRecentemente()).toBe(true)
  })

  it('invalida o cache após o tempo configurado', () => {
    marcarSessaoVerificada()

    vi.advanceTimersByTime(5 * 60 * 1000 + 1)

    expect(sessaoVerificadaRecentemente()).toBe(false)
  })
})
