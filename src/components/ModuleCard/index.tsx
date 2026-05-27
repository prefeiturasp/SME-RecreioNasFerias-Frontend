import type { ReactNode } from 'react'
import { CardModulo } from './style'

type ModuleCardProps = {
  nome: string
  icone: ReactNode
}

export function ModuleCard({ nome, icone }: ModuleCardProps) {
  return (
    <CardModulo type="button" aria-label={nome}>
      {icone}
      <span>{nome}</span>
    </CardModulo>
  )
}
