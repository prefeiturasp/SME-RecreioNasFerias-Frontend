import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '../../utils/mascarasEntrada'
import {
  STATUS_POLO_PARCEIRO_PADRAO,
  type DadosCadastroPoloParceiro,
  type PoloParceiroDetalhado,
  type StatusPoloParceiro,
} from './types'

const TIPO_POLO_PARCEIRO_PADRAO = 'Parceiro'

function obterCampoTextoFormulario(dados: FormData, nomeCampo: string): string {
  const valor = dados.get(nomeCampo)
  return typeof valor === 'string' ? valor : ''
}

export function obterDadosCadastroFormulario(
  form: HTMLFormElement,
  tipo: string = TIPO_POLO_PARCEIRO_PADRAO,
): DadosCadastroPoloParceiro {
  const dados = new FormData(form)

  return {
    tipo,
    nomeOsc: obterCampoTextoFormulario(dados, 'NomeOsc'),
    nomePolo: obterCampoTextoFormulario(dados, 'NomePolo'),
    dre: obterCampoTextoFormulario(dados, 'Dre'),
    tipoUe: obterCampoTextoFormulario(dados, 'TipoUe'),
    quantidadeMaximaAlunos: obterCampoTextoFormulario(
      dados,
      'QuantidadeMaximaAlunos',
    ),
    cep: obterCampoTextoFormulario(dados, 'Cep'),
    endereco: obterCampoTextoFormulario(dados, 'Endereco'),
    nomeGestor: obterCampoTextoFormulario(dados, 'NomeGestor'),
    emailPolo: obterCampoTextoFormulario(dados, 'EmailPolo'),
    telefonePolo: obterCampoTextoFormulario(dados, 'TelefonePolo'),
    status: (obterCampoTextoFormulario(dados, 'Status') ||
      STATUS_POLO_PARCEIRO_PADRAO) as StatusPoloParceiro,
    observacoes: obterCampoTextoFormulario(dados, 'Observacoes'),
  }
}

export function poloParaDadosFormulario(
  polo: PoloParceiroDetalhado,
): DadosCadastroPoloParceiro {
  return {
    tipo: polo.tipo,
    nomeOsc: polo.nomeOsc,
    nomePolo: polo.nomePolo,
    dre: polo.dre,
    tipoUe: polo.tipoUe,
    quantidadeMaximaAlunos: String(polo.quantidadeMaximaAlunos),
    cep: aplicarMascaraCep(polo.cep),
    endereco: polo.endereco,
    nomeGestor: polo.nomeGestor,
    emailPolo: polo.emailPolo,
    telefonePolo: aplicarMascaraTelefone(polo.telefonePolo),
    status: polo.status,
    observacoes: polo.observacoesGerais,
  }
}

export function dadosCadastroSaoIguais(
  atual: DadosCadastroPoloParceiro,
  inicial: DadosCadastroPoloParceiro,
): boolean {
  return (
    atual.nomeOsc === inicial.nomeOsc &&
    atual.nomePolo === inicial.nomePolo &&
    atual.dre === inicial.dre &&
    atual.tipoUe === inicial.tipoUe &&
    atual.quantidadeMaximaAlunos === inicial.quantidadeMaximaAlunos &&
    atual.cep === inicial.cep &&
    atual.endereco === inicial.endereco &&
    atual.nomeGestor === inicial.nomeGestor &&
    atual.emailPolo === inicial.emailPolo &&
    atual.telefonePolo === inicial.telefonePolo &&
    atual.status === inicial.status &&
    atual.observacoes === inicial.observacoes
  )
}
