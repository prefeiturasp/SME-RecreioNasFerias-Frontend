export type PerfilUsuario = {
  rf: string
  nome: string
  descricaoCargo: string
  perfis: string[]
  permissoes: string[]
}

export type SessaoAutenticacao = PerfilUsuario & {
  token: string
}
