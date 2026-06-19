import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ContextoMenuLateral } from './contextoMenuLateral'

type ProvedorEstadoMenuLateralProps = {
  children: ReactNode
}

export function ProvedorEstadoMenuLateral({
  children,
}: Readonly<ProvedorEstadoMenuLateralProps>) {
  const [menuAberto, setMenuAberto] = useState(false)

  const abrirMenu = useCallback(() => {
    setMenuAberto(true)
  }, [])

  const fecharMenu = useCallback(() => {
    setMenuAberto(false)
  }, [])

  const valor = useMemo(
    () => ({
      menuAberto,
      abrirMenu,
      fecharMenu,
    }),
    [menuAberto, abrirMenu, fecharMenu],
  )

  return (
    <ContextoMenuLateral.Provider value={valor}>
      {children}
    </ContextoMenuLateral.Provider>
  )
}
