import { afterEach, describe, expect, it } from 'vitest'
import { construirUrlApi } from './construirUrlApi'

describe('construirUrlApi', () => {
  afterEach(() => {
    delete globalThis.__ENV__
  })

  it('retorna rota relativa quando VITE_API_BASE_URL não está configurada', () => {
    const original = import.meta.env.VITE_API_BASE_URL
    import.meta.env.VITE_API_BASE_URL = ''

    expect(construirUrlApi('/api/auth/login/')).toBe('/api/auth/login/')
    expect(construirUrlApi('api/usuarios')).toBe('/api/usuarios')

    import.meta.env.VITE_API_BASE_URL = original
  })

  it('combina base configurada com o path normalizado', () => {
    const original = import.meta.env.VITE_API_BASE_URL
    import.meta.env.VITE_API_BASE_URL = 'https://api.exemplo.com/'

    expect(construirUrlApi('/api/auth/login/')).toBe(
      'https://api.exemplo.com/api/auth/login/',
    )

    import.meta.env.VITE_API_BASE_URL = original
  })

  it('prioriza base configurada em runtime', () => {
    import.meta.env.VITE_API_BASE_URL = 'https://build.exemplo.com'
    globalThis.__ENV__ = {
      VITE_API_BASE_URL: 'https://runtime.exemplo.com',
    }

    expect(construirUrlApi('/api/auth/login/')).toBe(
      'https://runtime.exemplo.com/api/auth/login/',
    )
  })
})
