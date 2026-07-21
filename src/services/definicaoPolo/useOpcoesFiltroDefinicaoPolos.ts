import { useEffect, useState } from 'react'

import { listarOpcoesFiltroDefinicaoPolos } from './api'
import type { OpcoesFiltroDefinicaoPolos } from './types'

const OPCOES_VAZIAS: OpcoesFiltroDefinicaoPolos = {
  dres: [],
  tiposUe: [],
  gestoes: [],
  nomesEdicao: [],
  tiposPolo: [],
}

export function useOpcoesFiltroDefinicaoPolos() {
  const [opcoes, setOpcoes] =
    useState<OpcoesFiltroDefinicaoPolos>(OPCOES_VAZIAS)
  const [estaCarregando, setEstaCarregando] = useState(true)

  useEffect(() => {
    void listarOpcoesFiltroDefinicaoPolos()
      .then((resultado) => {
        setOpcoes(resultado)
      })
      .catch(() => {
        setOpcoes(OPCOES_VAZIAS)
      })
      .finally(() => {
        setEstaCarregando(false)
      })
  }, [])

  return {
    opcoesDre: opcoes.dres,
    opcoesTipoUe: opcoes.tiposUe,
    opcoesGestao: opcoes.gestoes,
    opcoesNomeEdicao: opcoes.nomesEdicao,
    opcoesTipoPolo: opcoes.tiposPolo,
    estaCarregando,
  }
}
