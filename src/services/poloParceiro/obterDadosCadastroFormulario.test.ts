import { describe, expect, it } from 'vitest'

import {
  dadosCadastroSaoIguais,
  obterDadosCadastroFormulario,
  poloParaDadosFormulario,
} from './obterDadosCadastroFormulario'
import type { DadosCadastroPoloParceiro, PoloParceiroDetalhado } from './types'

const dadosFormularioExemplo: DadosCadastroPoloParceiro = {
  tipo: 'Pendente',
  nomeOsc: 'OSC Teste',
  nomePolo: 'Polo Teste',
  dre: 'DRE Butantã',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: '50',
  cep: '01310-100',
  endereco: 'Av. Paulista, 1000',
  nomeGestor: 'Gestor Teste',
  emailPolo: 'polo@teste.com',
  telefonePolo: '(11) 99999-9999',
  status: 'ativo',
  observacoes: 'Observação inicial',
}

const poloDetalhadoExemplo: PoloParceiroDetalhado = {
  id: '11111111-1111-1111-1111-111111111111',
  tipo: 'Pendente',
  nomeOsc: 'OSC Teste',
  nomePolo: 'Polo Teste',
  dre: 'DRE Butantã',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: 50,
  cep: '01310100',
  endereco: 'Av. Paulista, 1000',
  nomeGestor: 'Gestor Teste',
  emailPolo: 'polo@teste.com',
  telefonePolo: '11999999999',
  status: 'ativo',
  observacoesGerais: 'Observação inicial',
}

function criarFormularioComDados(
  dados: DadosCadastroPoloParceiro,
): HTMLFormElement {
  const form = document.createElement('form')

  const campos: [string, string][] = [
    ['NomeOsc', dados.nomeOsc],
    ['NomePolo', dados.nomePolo],
    ['Dre', dados.dre],
    ['TipoUe', dados.tipoUe],
    ['QuantidadeMaximaAlunos', dados.quantidadeMaximaAlunos],
    ['Cep', dados.cep],
    ['Endereco', dados.endereco],
    ['NomeGestor', dados.nomeGestor],
    ['EmailPolo', dados.emailPolo],
    ['TelefonePolo', dados.telefonePolo],
    ['Observacoes', dados.observacoes],
  ]

  for (const [nome, valor] of campos) {
    const input = document.createElement('input')
    input.name = nome
    input.value = valor
    form.appendChild(input)
  }

  return form
}

describe('obterDadosCadastroFormulario', () => {
  it('extrai os dados do formulário com tipo padrão', () => {
    const form = criarFormularioComDados(dadosFormularioExemplo)

    expect(obterDadosCadastroFormulario(form)).toEqual(dadosFormularioExemplo)
  })

  it('extrai os dados do formulário com tipo informado', () => {
    const form = criarFormularioComDados(dadosFormularioExemplo)

    expect(obterDadosCadastroFormulario(form, 'Outro')).toEqual({
      ...dadosFormularioExemplo,
      tipo: 'Outro',
    })
  })

  it('define status ativo quando o campo não está no formulário', () => {
    const form = criarFormularioComDados({
      ...dadosFormularioExemplo,
      status: 'inativo',
    })
    form.querySelector('[name="Status"]')?.remove()

    expect(obterDadosCadastroFormulario(form).status).toBe('ativo')
  })

  it('extrai o status informado no formulário', () => {
    const form = criarFormularioComDados(dadosFormularioExemplo)
    const select = document.createElement('select')
    select.name = 'Status'
    select.value = 'inativo'
    const option = document.createElement('option')
    option.value = 'inativo'
    select.appendChild(option)
    form.appendChild(select)

    expect(obterDadosCadastroFormulario(form).status).toBe('inativo')
  })
})

describe('poloParaDadosFormulario', () => {
  it('converte polo detalhado para dados do formulário com máscaras', () => {
    expect(poloParaDadosFormulario(poloDetalhadoExemplo)).toEqual(
      dadosFormularioExemplo,
    )
  })
})

describe('dadosCadastroSaoIguais', () => {
  it('retorna true quando os dados são iguais', () => {
    expect(
      dadosCadastroSaoIguais(dadosFormularioExemplo, {
        ...dadosFormularioExemplo,
      }),
    ).toBe(true)
  })

  it('retorna false quando há diferença em qualquer campo', () => {
    expect(
      dadosCadastroSaoIguais(dadosFormularioExemplo, {
        ...dadosFormularioExemplo,
        nomePolo: 'Outro polo',
      }),
    ).toBe(false)
  })
})
