import { extrairMensagemDeErro } from '../api/extrairMensagemDeErro'
import { api } from '../api/http'
import { interpretarRespostaListagemPolosParceirosPaginada } from './interpretarRespostaListagemPolosParceiros'
import {
  PARAMETROS_LISTAGEM_POLOS_PARCEIROS_INICIAIS,
  type ListagemPolosParceiros,
  type ParametrosListagemPolosParceiros,
} from './types'

export class ErroListagemPolosParceiros extends Error {
  readonly mensagemUsuario: string

  constructor(mensagemUsuario: string) {
    super('LISTAGEM_POLOS_PARCEIROS_FAILED')
    this.name = 'ErroListagemPolosParceiros'
    this.mensagemUsuario = mensagemUsuario
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
