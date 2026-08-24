import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarRespostaListagemEdicoesPaginada } from './interpretarRespostaListagemEdicoes'
import type {
  ListagemEdicoesPrograma,
  ParametrosListagemEdicoesPrograma,
} from './types'

const ROTA_LISTAGEM_EDICOES = '/api/v1/edicoes/'

export class ErroListagemEdicoesPrograma extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_EDICOES_FAILED')
    this.name = 'ErroListagemEdicoesPrograma'
    this.mensagemUsuario = mensagemUsuario
  }
}

export async function listarEdicoesPrograma({
  pagina = 1,
  tamanhoPagina = 10,
}: ParametrosListagemEdicoesPrograma = {}): Promise<ListagemEdicoesPrograma> {
  try {
    const { data } = await api.get(ROTA_LISTAGEM_EDICOES, {
      params: {
        page: String(pagina),
        pageSize: String(tamanhoPagina),
      },
    })

    const listagem = interpretarRespostaListagemEdicoesPaginada(data as unknown)

    if (!listagem) {
      throw new ErroListagemEdicoesPrograma('Resposta de listagem inválida.')
    }

    return listagem
  } catch (error) {
    if (error instanceof ErroListagemEdicoesPrograma) {
      throw error
    }

    throw new ErroListagemEdicoesPrograma(
      extrairMensagemDeErro(error) ||
        'Não foi possível carregar as edições do programa.',
    )
  }
}
