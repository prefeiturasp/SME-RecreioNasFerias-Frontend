export type StatusPolo = 'ativo' | 'inativo'

export type Polo = {
  id: string
  dre: string
  tipoUe: string
  nomePolo: string
  nomeOsc: string
}

export type PoloDetalhado = {
  id: string
  tipo: string
  nomeOsc: string
  nomePolo: string
  dre: string
  tipoUe: string
  quantidadeMaximaAlunos: number
  cep: string
  endereco: string
  nomeGestor: string
  emailPolo: string
  telefonePolo: string
  status: StatusPolo
  observacoesGerais: string
}

export type DadosCadastroPolo = {
  tipo: string
  nomeOsc: string
  nomePolo: string
  dre: string
  tipoUe: string
  quantidadeMaximaAlunos: string
  cep: string
  endereco: string
  nomeGestor: string
  emailPolo: string
  telefonePolo: string
  status: StatusPolo
  observacoes: string
}
