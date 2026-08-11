import { describe, expect, it } from 'vitest'
import {
  dadosFormularioEdicaoSaoIguais,
  obterCampoTextoFormulario,
  obterDadosFormularioEdicao,
} from './obterDadosFormularioEdicao'

describe('obterDadosFormularioEdicao', () => {
  it('retorna string vazia quando o campo não é texto', () => {
    const dados = new FormData()
    dados.append('arquivo', new Blob(['x']))

    expect(obterCampoTextoFormulario(dados, 'arquivo')).toBe('')
    expect(obterCampoTextoFormulario(dados, 'inexistente')).toBe('')
  })

  it('extrai os campos editáveis do formulário', () => {
    const form = document.createElement('form')
    form.innerHTML = `
      <input name="NomeDaEdicao" value="Janeiro 2026" />
      <input name="DataInicioEdicao" value="2026-01-01" />
      <input name="DataFimEdicao" value="2026-01-31" />
      <input name="DataInicioInscricoes" value="2025-12-01" />
      <input name="DataFimInscricoes" value="2025-12-31" />
    `

    expect(obterDadosFormularioEdicao(form)).toEqual({
      nome: 'Janeiro 2026',
      dataInicioEdicao: '2026-01-01',
      dataFimEdicao: '2026-01-31',
      dataInicioInscricoes: '2025-12-01',
      dataFimInscricoes: '2025-12-31',
    })
  })

  it('compara igualdade dos dados do formulário', () => {
    const base = {
      nome: 'A',
      dataInicioEdicao: '2026-01-01',
      dataFimEdicao: '2026-01-31',
      dataInicioInscricoes: '2025-12-01',
      dataFimInscricoes: '2025-12-31',
    }

    expect(dadosFormularioEdicaoSaoIguais(base, { ...base })).toBe(true)
    expect(
      dadosFormularioEdicaoSaoIguais(base, { ...base, nome: 'B' }),
    ).toBe(false)
  })
})
