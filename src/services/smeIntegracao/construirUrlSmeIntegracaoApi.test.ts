import { describe, expect, it } from 'vitest'

import { construirUrlSmeIntegracaoApi } from './construirUrlSmeIntegracaoApi'

describe('construirUrlSmeIntegracaoApi', () => {
  it('usa proxy local quando VITE_SME_INTEGRACAO_API_BASE_URL não está configurada', () => {
    const original = import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL = ''

    expect(
      construirUrlSmeIntegracaoApi('/api/abrangencia/nome-abreviacao-dres'),
    ).toBe('/sme-integracao-api/api/abrangencia/nome-abreviacao-dres')

    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL = original
  })

  it('usa proxy local em desenvolvimento mesmo com base URL configurada', () => {
    const original = import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL
    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL =
      'https://hom-smeintegracaoapi.sme.prefeitura.sp.gov.br/'

    expect(
      construirUrlSmeIntegracaoApi('/api/abrangencia/nome-abreviacao-dres'),
    ).toBe('/sme-integracao-api/api/abrangencia/nome-abreviacao-dres')

    import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL = original
  })
})
