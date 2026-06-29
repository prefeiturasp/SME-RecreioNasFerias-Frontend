import type { DadosCadastroPoloParceiro } from './types'
import { OPCOES_STATUS_POLO_PARCEIRO } from './types'
import { extrairDigitos } from '../../utils/mascarasEntrada'

const CAMPOS_OBRIGATORIOS: (keyof DadosCadastroPoloParceiro)[] = [
  'nomeOsc',
  'nomePolo',
  'dre',
  'tipoUe',
  'quantidadeMaximaAlunos',
  'cep',
  'endereco',
  'nomeGestor',
  'emailPolo',
  'telefonePolo',
  'status',
]

function campoEstaPreenchido(valor: string): boolean {
  return valor.trim().length > 0
}

function cepEstaPreenchido(valor: string): boolean {
  return extrairDigitos(valor).length === 8
}

function telefoneEstaPreenchido(valor: string): boolean {
  const quantidadeDigitos = extrairDigitos(valor).length
  return quantidadeDigitos === 10 || quantidadeDigitos === 11
}

export function formularioCadastroEstaPreenchido(
  dados: DadosCadastroPoloParceiro,
): boolean {
  return (
    CAMPOS_OBRIGATORIOS.every((campo) => {
      if (campo === 'cep') {
        return cepEstaPreenchido(dados.cep)
      }

      if (campo === 'telefonePolo') {
        return telefoneEstaPreenchido(dados.telefonePolo)
      }

      return campoEstaPreenchido(dados[campo])
    })
  )
}

export function validarCadastroPoloParceiro(
  dados: DadosCadastroPoloParceiro,
): string | null {
  if (!formularioCadastroEstaPreenchido(dados)) {
    return 'Preencha todos os campos obrigatórios.'
  }

  const quantidade = Number(dados.quantidadeMaximaAlunos)
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return 'Informe uma quantidade máxima de alunos válida.'
  }

  const email = dados.emailPolo.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Informe um e-mail válido para o polo.'
  }

  if (!cepEstaPreenchido(dados.cep)) {
    return 'Informe um CEP válido.'
  }

  if (!telefoneEstaPreenchido(dados.telefonePolo)) {
    return 'Informe um telefone válido para o polo.'
  }

  const statusValido = OPCOES_STATUS_POLO_PARCEIRO.some(
    (opcao) => opcao.valor === dados.status,
  )
  if (!statusValido) {
    return 'Selecione um status válido.'
  }

  return null
}
