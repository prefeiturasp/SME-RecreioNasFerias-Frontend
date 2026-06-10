import { describe, expect, it } from 'vitest'
import { montarPaginasVisiveis } from './montarPaginasVisiveis'

describe('montarPaginasVisiveis', () => {
  it('retorna todas as páginas quando o total é pequeno', () => {
    expect(montarPaginasVisiveis(1, 5)).toEqual([
      { tipo: 'pagina', chave: 'pagina-1', numero: 1 },
      { tipo: 'pagina', chave: 'pagina-2', numero: 2 },
      { tipo: 'pagina', chave: 'pagina-3', numero: 3 },
      { tipo: 'pagina', chave: 'pagina-4', numero: 4 },
      { tipo: 'pagina', chave: 'pagina-5', numero: 5 },
    ])
  })

  it('monta páginas iniciais com reticências e última página', () => {
    expect(montarPaginasVisiveis(1, 20)).toEqual([
      { tipo: 'pagina', chave: 'pagina-1', numero: 1 },
      { tipo: 'pagina', chave: 'pagina-2', numero: 2 },
      { tipo: 'pagina', chave: 'pagina-3', numero: 3 },
      { tipo: 'pagina', chave: 'pagina-4', numero: 4 },
      { tipo: 'pagina', chave: 'pagina-5', numero: 5 },
      { tipo: 'ellipsis', chave: 'ellipsis-inicio-fim' },
      { tipo: 'pagina', chave: 'pagina-20', numero: 20 },
    ])
  })

  it('monta páginas intermediárias com reticências nas extremidades', () => {
    expect(montarPaginasVisiveis(10, 20)).toEqual([
      { tipo: 'pagina', chave: 'pagina-1', numero: 1 },
      { tipo: 'ellipsis', chave: 'ellipsis-inicio-meio' },
      { tipo: 'pagina', chave: 'pagina-9', numero: 9 },
      { tipo: 'pagina', chave: 'pagina-10', numero: 10 },
      { tipo: 'pagina', chave: 'pagina-11', numero: 11 },
      { tipo: 'ellipsis', chave: 'ellipsis-meio-fim' },
      { tipo: 'pagina', chave: 'pagina-20', numero: 20 },
    ])
  })

  it('monta páginas finais com reticências no início', () => {
    expect(montarPaginasVisiveis(20, 20)).toEqual([
      { tipo: 'pagina', chave: 'pagina-1', numero: 1 },
      { tipo: 'ellipsis', chave: 'ellipsis-inicio-meio' },
      { tipo: 'pagina', chave: 'pagina-16', numero: 16 },
      { tipo: 'pagina', chave: 'pagina-17', numero: 17 },
      { tipo: 'pagina', chave: 'pagina-18', numero: 18 },
      { tipo: 'pagina', chave: 'pagina-19', numero: 19 },
      { tipo: 'pagina', chave: 'pagina-20', numero: 20 },
    ])
  })
})
