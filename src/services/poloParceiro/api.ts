import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
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

export async function listarPolosParceiros({
  pagina = 1,
  tamanhoPagina = 10,
  dre = '',
  tipoUe = '',
  nomePoloOuOsc = '',
}: ParametrosListagemPolosParceiros = PARAMETROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS): Promise<ListagemPolosParceiros> {
  const params: Record<string, string> = {
    page: String(pagina),
    pageSize: String(tamanhoPagina),
    gestao: 'Parceira',
  }

  if (dre.trim()) {
    params.dre = dre.trim()
  }

  if (tipoUe.trim()) {
    params.tipoUe = tipoUe.trim()
  }

  if (nomePoloOuOsc.trim()) {
    params.nomePoloOuOsc = nomePoloOuOsc.trim()
  }

  try {
    const { data } = await api.get('/api/polos/', { params })

    const listagem = interpretarRespostaListagemPolosParceirosPaginada(
      data as unknown,
    )

    if (!listagem) {
      throw new ErroListagemPolosParceiros('Resposta de listagem inválida.')
    }

    return listagem
  } catch (error) {
    if (error instanceof ErroListagemPolosParceiros) {
      throw error
    }

    throw new ErroListagemPolosParceiros(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar os polos parceiros.',
    )
  }
}

export async function cadastrarPoloParceiro(
  dados: DadosCadastroPoloParceiro,
): Promise<PoloParceiro> {
  try {
    const { data } = await api.post(
      '/api/polos/',
      montarPayloadCadastroPoloParceiro(dados),
    )

    const polo = interpretarRespostaPoloParceiro(data as unknown)

    if (!polo) {
      throw new ErroCadastroPoloParceiro('Resposta de cadastro inválida.')
    }

    return polo
  } catch (error) {
    if (error instanceof ErroCadastroPoloParceiro) {
      throw error
    }

    throw new ErroCadastroPoloParceiro(
      extrairMensagemDeErro(error) ||
        'Não foi possível cadastrar o polo parceiro.',
    )
  }
}

export async function obterPoloParceiro(
  id: string,
): Promise<PoloParceiroDetalhado> {
  try {
    const { data } = await api.get(`/api/polos/${id}/`)

    const polo = interpretarRespostaPoloParceiroDetalhado(data as unknown)

    if (!polo) {
      throw new ErroObterPoloParceiro('Resposta de consulta inválida.')
    }

    return polo
  } catch (error) {
    if (error instanceof ErroObterPoloParceiro) {
      throw error
    }

    throw new ErroObterPoloParceiro(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar o polo parceiro.',
    )
  }
}

export async function atualizarPoloParceiro(
  id: string,
  dados: DadosCadastroPoloParceiro,
): Promise<PoloParceiro> {
  try {
    const { data } = await api.put(
      `/api/polos/${id}/`,
      montarPayloadCadastroPoloParceiro(dados),
    )

    const polo = interpretarRespostaPoloParceiro(data as unknown)

    if (!polo) {
      throw new ErroAtualizacaoPoloParceiro('Resposta de atualização inválida.')
    }

    return polo
  } catch (error) {
    if (error instanceof ErroAtualizacaoPoloParceiro) {
      throw error
    }

    throw new ErroAtualizacaoPoloParceiro(
      extrairMensagemDeErro(error) ||
        'Não foi possível atualizar o polo parceiro.',
    )
  }
}
