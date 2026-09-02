import type { ReactNode } from 'react'

export type DefinicaoColuna<T> = {
  id: string
  rotulo: string
  valorOrdenacao: (item: T) => string | number
  renderizar: (item: T) => ReactNode
}
