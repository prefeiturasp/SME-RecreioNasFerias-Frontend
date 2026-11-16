import { obterPerfilUsuario } from '@/services/autenticacao'

export function usePermissoesUsuario() {
  const permissoes = obterPerfilUsuario()?.permissoes

  return {
    possuiPermissao: (codigo: string) => permissoes?.includes(codigo) ?? false,
  }
}
