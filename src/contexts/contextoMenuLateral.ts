import { createContext } from 'react'

export type EstadoMenuLateralContextValue = {
  menuAberto: boolean
  abrirMenu: () => void
  fecharMenu: () => void
}

export const ContextoMenuLateral =
  createContext<EstadoMenuLateralContextValue | null>(null)
