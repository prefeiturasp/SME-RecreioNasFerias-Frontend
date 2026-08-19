export {
  definirPerfilUsuario,
  definirSessaoAutenticacao,
  definirTokenAutenticacao,
  estaAutenticado,
  limparSessaoAutenticacao,
  obterPerfilUsuario,
  obterSessaoAutenticacao,
  obterTokenAutenticacao,
} from './storage'
export {
  extrairPerfilUsuario,
  interpretarRespostaLogin,
} from './interpretarRespostaLogin'
export { obterDadosUsuarioAutenticado } from './obterDadosUsuarioAutenticado'
export { restaurarSessaoAutenticacao } from './restaurarSessaoAutenticacao'
export { atualizarTokenAutenticacaoViaRefresh } from './refreshToken'
export { encerrarSessaoAutenticacao } from './logout'
export { login, ErroAcessoNegadoLogin, ErroFalhaLogin } from './login'
export type { CredenciaisLogin } from './login'
export {
  invalidarCacheVerificacaoSessao,
  marcarSessaoVerificada,
  sessaoVerificadaRecentemente,
} from './cacheVerificacaoSessao'
export {
  notificarSessaoInvalida,
  registrarOuvinteSessaoInvalida,
  respostaIndicaSessaoInvalida,
} from './sessaoInvalida'
export {
  deveVerificarSessaoNaRota,
  ROTA_LISTAGEM_EDICOES_PROGRAMA,
  verificarSessaoAtiva,
} from './verificarSessaoAtiva'
export type { PerfilUsuario, SessaoAutenticacao } from './types'
