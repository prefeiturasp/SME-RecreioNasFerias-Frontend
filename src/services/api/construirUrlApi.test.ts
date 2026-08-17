import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { construirUrlApi } from './construirUrlApi'

describe('construirUrlApi', () => {
  const originalEnv = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  }

  beforeEach(() => {
    delete globalThis.__ENV__
    import.meta.env.VITE_API_BASE_URL = ''
  })

  afterEach(() => {
    delete globalThis.__ENV__
    import.meta.env.VITE_API_BASE_URL = originalEnv.VITE_API_BASE_URL
  })

  it('retorna rota relativa quando não há URL base configurada', () => {
    expect(construirUrlApi('/api/v1/auth/login/')).toBe('/api/v1/auth/login/')
    expect(construirUrlApi('api/usuarios')).toBe('/api/usuarios')
  })

  it('usa a URL base do build quando configurada', () => {
    import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000'

    expect(construirUrlApi('/api/v1/auth/token/refresh/')).toBe(
      'http://localhost:8000/api/v1/auth/token/refresh/',
    )
  })

  it('prioriza a URL base de runtime sobre a do build', () => {
    import.meta.env.VITE_API_BASE_URL = 'https://build.exemplo.com'
    globalThis.__ENV__ = {
      VITE_API_BASE_URL: 'https://runtime.exemplo.com',
    }

    expect(construirUrlApi('/api/v1/auth/login/')).toBe(
      'https://runtime.exemplo.com/api/v1/auth/login/',
    )
  })

  it('remove barra final da URL base', () => {
    import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000/'

    expect(construirUrlApi('/api/v1/auth/me/')).toBe(
      'http://localhost:8000/api/v1/auth/me/',
    )
  })

  it('normaliza o caminho mesmo com URL base configurada', () => {
    import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000'

    expect(construirUrlApi('api/v1/auth/logout/')).toBe(
      'http://localhost:8000/api/v1/auth/logout/',
    )
  })

  it('ignora URL base que é apenas um placeholder', () => {
    globalThis.__ENV__ = {
      VITE_API_BASE_URL: '${VITE_API_BASE_URL}',
    }

    expect(construirUrlApi('/api/v1/auth/login/')).toBe('/api/v1/auth/login/')
  })
})
