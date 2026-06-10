import { useContext } from 'react'
import { ContextoMenuLateral } from './contextoMenuLateral'

export function useEstadoMenuLateral() {
  const contexto = useContext(ContextoMenuLateral)

  if (!contexto) {
    throw new Error(
      'useEstadoMenuLateral deve ser usado dentro de ProvedorEstadoMenuLateral',
    )
  }

  return contexto
}
