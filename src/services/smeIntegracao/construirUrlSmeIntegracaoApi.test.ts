import { describe, expect, it } from 'vitest'

import { construirUrlSmeIntegracaoApi } from './construirUrlSmeIntegracaoApi'

describe('construirUrlSmeIntegracaoApi', () => {
  it('usa rota relativa para o proxy da SME Integração', () => {
    expect(
      construirUrlSmeIntegracaoApi('/api/abrangencia/nome-abreviacao-dres'),
    ).toBe('/sme-integracao-api/api/abrangencia/nome-abreviacao-dres')
  })

  it('normaliza path sem barra inicial', () => {
    expect(construirUrlSmeIntegracaoApi('api/escolas/tiposEscolas')).toBe(
      '/sme-integracao-api/api/escolas/tiposEscolas',
    )
  })
})
