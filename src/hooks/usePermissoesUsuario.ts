import { useCallback, useMemo } from 'react'

import { obterPerfilUsuario } from '@/services/autenticacao'

export function usePermissoesUsuario() {
  const perfil = obterPerfilUsuario()
  const chavePerfis = perfil?.perfis.join('\0') ?? ''
  const chavePermissoes = perfil?.permissoes.join('\0') ?? ''

  const perfis = useMemo(() => {
    return obterPerfilUsuario()?.perfis ?? []
  }, [chavePerfis])

  const permissoes = useMemo(() => {
    return obterPerfilUsuario()?.permissoes ?? []
  }, [chavePermissoes])

  const possuiPermissao = useCallback(
    (codigo: string) => permissoes.includes(codigo),
    [permissoes],
  )

  return { perfis, permissoes, possuiPermissao }
}
