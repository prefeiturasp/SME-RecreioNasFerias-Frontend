export type PerfilUsuario = {
  rf: string
  nome: string
  descricaoCargo: string
}

export type SessaoAutenticacao = PerfilUsuario & {
  token: string
}
