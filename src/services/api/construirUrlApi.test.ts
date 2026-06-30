import { describe, expect, it } from 'vitest'
import { construirUrlApi } from './construirUrlApi'

describe('construirUrlApi', () => {
  it('retorna rota relativa para o proxy do backend', () => {
    expect(construirUrlApi('/api/auth/login/')).toBe('/api/auth/login/')
    expect(construirUrlApi('api/usuarios')).toBe('/api/usuarios')
  })
})
