import { requisicaoAutenticada } from '../autenticacao'
import { interpretarRespostaPoloParceiroDetalhado } from './interpretarRespostaPoloParceiroDetalhado'
import { interpretarRespostaListagemPolosParceirosPaginada } from './interpretarRespostaListagemPolosParceiros'
import {
  PARAMETROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
  type DadosCadastroPoloParceiro,
  type ListagemPolosParceiros,
  type ParametrosListagemPolosParceiros,
  type PoloParceiro,
  type PoloParceiroDetalhado,
} from './types'

export class ErroListagemPolosParceiros extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_POLOS_PARCEIROS_FAILED')
    this.name = 'ErroListagemPolosParceiros'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroCadastroPoloParceiro extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('CADASTRO_POLO_PARCEIRO_FAILED')
    this.name = 'ErroCadastroPoloParceiro'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroObterPoloParceiro extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('OBTER_POLO_PARCEIRO_FAILED')
    this.name = 'ErroObterPoloParceiro'
    this.mensagemUsuario = mensagemUsuario
  }
}

export class ErroAtualizacaoPoloParceiro extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('ATUALIZACAO_POLO_PARCEIRO_FAILED')
    this.name = 'ErroAtualizacaoPoloParceiro'
    this.mensagemUsuario = mensagemUsuario
  }
}

function montarPayloadCadastroPoloParceiro(dados: DadosCadastroPoloParceiro) {
  return {
    nomeOsc: dados.nomeOsc.trim(),
    nomePolo: dados.nomePolo.trim(),
    dre: dados.dre.trim(),
    tipoUe: dados.tipoUe.trim(),
    quantidadeMaximaAlunos: Number(dados.quantidadeMaximaAlunos),
    cep: dados.cep.trim(),
    endereco: dados.endereco.trim(),
    nomeGestor: dados.nomeGestor.trim(),
    emailPolo: dados.emailPolo.trim(),
    telefonePolo: dados.telefonePolo.trim(),
    status: dados.status.trim(),
    observacoesGerais: dados.observacoes.trim(),
  }
}

function interpretarRespostaPoloParceiro(dados: unknown): PoloParceiro | null {
  if (!dados || typeof dados !== 'object') {
    return null
  }

  const registro = dados as Record<string, unknown>

  if (
    typeof registro.id !== 'string' ||
    typeof registro.dre !== 'string' ||
    typeof registro.tipoUe !== 'string' ||
    typeof registro.nomePolo !== 'string' ||
    typeof registro.nomeOsc !== 'string'
  ) {
    return null
  }

  return {
    id: registro.id,
    dre: registro.dre,
    tipoUe: registro.tipoUe,
    nomePolo: registro.nomePolo,
    nomeOsc: registro.nomeOsc,
  }
}

async function extrairMensagemDeErroDaResposta(
  response: Response,
): Promise<string> {
  const corpo = await response.text()
  if (!corpo.trim()) {
    return ''
  }

  try {
    const dados = JSON.parse(corpo) as unknown
    if (dados && typeof dados === 'object') {
      if (
        'error' in dados &&
        typeof (dados as { error: unknown }).error === 'string'
      ) {
        return (dados as { error: string }).error
      }

      if (
        'detail' in dados &&
        typeof (dados as { detail: unknown }).detail === 'string'
      ) {
        return (dados as { detail: string }).detail
      }
    }
  } catch {
    // corpo não é JSON; exibe o texto bruto retornado pelo backend
  }

  return corpo
}

export async function listarPolosParceiros(
  {
    pagina = 1,
    tamanhoPagina = 10,
    dre = '',
    tipoUe = '',
    nomePoloOuOsc = '',
  }: ParametrosListagemPolosParceiros = PARAMETROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
): Promise<ListagemPolosParceiros> {
  const parametros = new URLSearchParams({
    page: String(pagina),
    pageSize: String(tamanhoPagina),
    gestao: 'Parceira',
  })

  if (dre.trim()) {
    parametros.set('dre', dre.trim())
  }

  if (tipoUe.trim()) {
    parametros.set('tipoUe', tipoUe.trim())
  }

  if (nomePoloOuOsc.trim()) {
    parametros.set('nomePoloOuOsc', nomePoloOuOsc.trim())
  }

  const response = await requisicaoAutenticada(
    `/api/polos/?${parametros.toString()}`,
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroListagemPolosParceiros(
      mensagem || 'Não foi possível carregar os polos parceiros.',
    )
  }

  const dados = await response.json()
  const listagem = interpretarRespostaListagemPolosParceirosPaginada(dados)

  if (!listagem) {
    throw new ErroListagemPolosParceiros('Resposta de listagem inválida.')
  }

  return listagem
}

export async function cadastrarPoloParceiro(
  dados: DadosCadastroPoloParceiro,
): Promise<PoloParceiro> {
  const response = await requisicaoAutenticada('/api/polos/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montarPayloadCadastroPoloParceiro(dados)),
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroCadastroPoloParceiro(
      mensagem || 'Não foi possível cadastrar o polo parceiro.',
    )
  }

  const resposta = await response.json()
  const polo = interpretarRespostaPoloParceiro(resposta)

  if (!polo) {
    throw new ErroCadastroPoloParceiro('Resposta de cadastro inválida.')
  }

  return polo
}

export async function obterPoloParceiro(
  id: string,
): Promise<PoloParceiroDetalhado> {
  const response = await requisicaoAutenticada(`/api/polos/${id}/`, {
    method: 'GET',
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroObterPoloParceiro(
      mensagem || 'Não foi possível carregar o polo parceiro.',
    )
  }

  const resposta = await response.json()
  const polo = interpretarRespostaPoloParceiroDetalhado(resposta)

  if (!polo) {
    throw new ErroObterPoloParceiro('Resposta de consulta inválida.')
  }

  return polo
}

export async function atualizarPoloParceiro(
  id: string,
  dados: DadosCadastroPoloParceiro,
): Promise<PoloParceiro> {
  const response = await requisicaoAutenticada(`/api/polos/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montarPayloadCadastroPoloParceiro(dados)),
  })

  if (!response.ok) {
    const mensagem = await extrairMensagemDeErroDaResposta(response)
    throw new ErroAtualizacaoPoloParceiro(
      mensagem || 'Não foi possível atualizar o polo parceiro.',
    )
  }

  const resposta = await response.json()
  const polo = interpretarRespostaPoloParceiro(resposta)

  if (!polo) {
    throw new ErroAtualizacaoPoloParceiro('Resposta de atualização inválida.')
  }

  return polo
}
