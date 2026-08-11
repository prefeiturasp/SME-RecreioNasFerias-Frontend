import { describe, expect, it } from 'vitest'
import {
  GRUPO_CADASTROS,
  GRUPOS_NAVEGACAO,
  rotaPertenceAoGrupo,
} from './navigation'

describe('navigation', () => {
  it('expõe o grupo Cadastros com os subitens esperados', () => {
    expect(GRUPOS_NAVEGACAO).toHaveLength(1)
    expect(GRUPO_CADASTROS.rotulo).toBe('Cadastros')
    expect(GRUPO_CADASTROS.subitens.map((item) => item.caminho)).toEqual([
      '/edicoes-programa',
      '/definicoes-polo',
      '/polos-parceiros',
    ])
  })

  it('identifica rotas pertencentes ao grupo Cadastros', () => {
    expect(rotaPertenceAoGrupo('/polos-parceiros', GRUPO_CADASTROS)).toBe(true)
    expect(
      rotaPertenceAoGrupo('/polos-parceiros/123', GRUPO_CADASTROS),
    ).toBe(true)
    expect(rotaPertenceAoGrupo('/inicio', GRUPO_CADASTROS)).toBe(false)
  })
})
