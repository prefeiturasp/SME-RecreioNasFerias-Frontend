import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  obterApiBaseUrl,
  obterSmeIntegracaoApiBaseUrl,
  obterSmeIntegracaoApiKey,
} from './variaveisAmbiente'

describe('variaveisAmbiente', () => {
  const originalEnv = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_SME_INTEGRACAO_API_BASE_URL:
      import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL,
    VITE_SME_INTEGRACAO_API_KEY: import.meta.env.VITE_SME_INTEGRACAO_API_KEY,
  }

  beforeEach(() => {
    delete window.__ENV__
    import.meta.env.VITE_API_BASE_URL = ''
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL = ''
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = ''
  })

  afterEach(() => {
    delete window.__ENV__
    import.meta.env.VITE_API_BASE_URL = originalEnv.VITE_API_BASE_URL
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL =
      originalEnv.VITE_SME_INTEGRACAO_API_BASE_URL
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY =
      originalEnv.VITE_SME_INTEGRACAO_API_KEY
  })

  it('prioriza valores de runtime sobre o build', () => {
    import.meta.env.VITE_API_BASE_URL = 'https://build.exemplo.com'
    window.__ENV__ = {
      VITE_API_BASE_URL: 'https://runtime.exemplo.com',
    }

    expect(obterApiBaseUrl()).toBe('https://runtime.exemplo.com')
  })

  it('usa valores do build quando runtime não foi substituído', () => {
    window.__ENV__ = {
      VITE_API_BASE_URL: '${VITE_API_BASE_URL}',
      VITE_SME_INTEGRACAO_API_BASE_URL: '${VITE_SME_INTEGRACAO_API_BASE_URL}',
      VITE_SME_INTEGRACAO_API_KEY: '${VITE_SME_INTEGRACAO_API_KEY}',
    }
    import.meta.env.VITE_API_BASE_URL = 'https://build.exemplo.com'
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL =
      'https://build-integracao.exemplo.com'
    import.meta.env.VITE_SME_INTEGRACAO_API_KEY = 'chave-build'

    expect(obterApiBaseUrl()).toBe('https://build.exemplo.com')
    expect(obterSmeIntegracaoApiBaseUrl()).toBe(
      'https://build-integracao.exemplo.com',
    )
    expect(obterSmeIntegracaoApiKey()).toBe('chave-build')
  })

  it('retorna string vazia quando nenhuma fonte está configurada', () => {
    expect(obterApiBaseUrl()).toBe('')
    expect(obterSmeIntegracaoApiBaseUrl()).toBe('')
    expect(obterSmeIntegracaoApiKey()).toBe('')
  })
})
