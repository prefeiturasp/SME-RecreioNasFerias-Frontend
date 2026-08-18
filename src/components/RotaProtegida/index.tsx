import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import {
  estaAutenticado,
  restaurarSessaoAutenticacao,
} from '../../services/autenticacao'
import { IndicadorCarregamento } from '../IndicadorCarregamento'

type PropriedadesRotaProtegida = Readonly<{
  children: ReactNode
}>

export function RotaProtegida({ children }: PropriedadesRotaProtegida) {
  const [verificandoAutenticacao, setVerificandoAutenticacao] = useState(
    () => !estaAutenticado(),
  )

  useEffect(() => {
    if (!verificandoAutenticacao) return

    let ignorar = false
    void restaurarSessaoAutenticacao().finally(() => {
      if (!ignorar) {
        setVerificandoAutenticacao(false)
      }
    })

    return () => {
      ignorar = true
    }
  }, [verificandoAutenticacao])

  if (verificandoAutenticacao) {
    return <IndicadorCarregamento mensagem="Verificando sessão..." />
  }

  if (!estaAutenticado()) {
    return <Navigate to="/" replace />
  }

  return children
}
