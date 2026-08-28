import { useEffect, useState } from 'react'

import { listarDresNomeAbreviacao, listarTiposEscola } from './api'
import type { DreNomeAbreviacao, TipoEscola } from './types'

export function useOpcoesIntegracaoPolosParceiros() {
  const [opcoesDre, setOpcoesDre] = useState<DreNomeAbreviacao[]>([])
  const [opcoesTipoUe, setOpcoesTipoUe] = useState<TipoEscola[]>([])
  const [estaCarregando, setEstaCarregando] = useState(true)

  useEffect(() => {
    setEstaCarregando(true)

    void Promise.all([
      listarDresNomeAbreviacao().catch(() => [] as DreNomeAbreviacao[]),
      listarTiposEscola().catch(() => [] as TipoEscola[]),
    ]).then(([dres, tiposEscolas]) => {
      setOpcoesDre(dres)
      setOpcoesTipoUe(tiposEscolas)
      setEstaCarregando(false)
    })
  }, [])

  return {
    opcoesDre,
    opcoesTipoUe,
    estaCarregando,
  }
}
