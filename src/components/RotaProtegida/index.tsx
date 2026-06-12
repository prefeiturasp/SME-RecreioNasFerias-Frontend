import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { estaAutenticado } from '../../services/autenticacao'

type PropriedadesRotaProtegida = Readonly<{
  children: ReactNode
}>

export function RotaProtegida({ children }: PropriedadesRotaProtegida) {
  if (!estaAutenticado()) {
    return <Navigate to="/" replace />
  }

  return children
}
