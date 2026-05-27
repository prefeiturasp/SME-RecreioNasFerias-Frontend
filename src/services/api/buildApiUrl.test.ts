import { describe, expect, it } from 'vitest'
import { buildApiUrl } from './buildApiUrl'

describe('buildApiUrl', () => {
  it('retorna rota relativa quando VITE_API_BASE_URL não está configurada', () => {
    const original = import.meta.env.VITE_API_BASE_URL
    import.meta.env.VITE_API_BASE_URL = ''

    expect(buildApiUrl('/api/auth/login/')).toBe('/api/auth/login/')
    expect(buildApiUrl('api/usuarios')).toBe('/api/usuarios')

    import.meta.env.VITE_API_BASE_URL = original
  })

  it('combina base configurada com o path normalizado', () => {
    const original = import.meta.env.VITE_API_BASE_URL
    import.meta.env.VITE_API_BASE_URL = 'https://api.exemplo.com/'

    expect(buildApiUrl('/api/auth/login/')).toBe(
      'https://api.exemplo.com/api/auth/login/',
    )

    import.meta.env.VITE_API_BASE_URL = original
  })
})
