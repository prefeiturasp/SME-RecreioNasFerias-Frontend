import { iconeCadastro } from '@/assets'

export type ItemNavegacao = {
  rotulo: string
  caminho: string
}

export type GrupoNavegacao = {
  id: string
  rotulo: string
  icone: string
  rotas: readonly string[]
  subitens: readonly ItemNavegacao[]
}

export const GRUPO_CADASTROS: GrupoNavegacao = {
  id: 'cadastros',
  rotulo: 'Cadastros',
  icone: iconeCadastro,
  rotas: ['/edicoes-programa', '/definicoes-polo', '/polos-parceiros'],
  subitens: [
    {
      rotulo: 'Cadastro de Edições',
      caminho: '/edicoes-programa',
    },
    {
      rotulo: 'Definições de Polo',
      caminho: '/definicoes-polo',
    },
    {
      rotulo: 'Cadastro de Polos Parceiros',
      caminho: '/polos-parceiros',
    },
  ],
}

export const GRUPOS_NAVEGACAO: readonly GrupoNavegacao[] = [GRUPO_CADASTROS]

export function rotaPertenceAoGrupo(
  pathname: string,
  grupo: GrupoNavegacao,
): boolean {
  return grupo.rotas.some((rota) => pathname.startsWith(rota))
}
