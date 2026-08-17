import { marcarSessaoVerificada } from './cacheVerificacaoSessao'
import { obterDadosUsuarioAutenticado } from './obterDadosUsuarioAutenticado'
import { atualizarTokenAutenticacaoViaRefresh } from './refreshToken'
import {
  definirPerfilUsuario,
  estaAutenticado,
  limparSessaoAutenticacao,
} from './storage'

let promessaRestauracaoSessao: Promise<void> | null = null

async function executarRestauracaoSessao(): Promise<void> {
  if (estaAutenticado()) {
    return
  }

  const token = await atualizarTokenAutenticacaoViaRefresh()
  if (token === null) {
    limparSessaoAutenticacao()
    return
  }

  const perfil = await obterDadosUsuarioAutenticado()
  if (perfil) {
    definirPerfilUsuario(perfil)
    marcarSessaoVerificada()
  }
}

export function restaurarSessaoAutenticacao(): Promise<void> {
  if (promessaRestauracaoSessao === null) {
    promessaRestauracaoSessao = executarRestauracaoSessao().finally(() => {
      promessaRestauracaoSessao = null
    })
  }

  return promessaRestauracaoSessao
}
