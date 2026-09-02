import { api } from '../api/http'
import type { OpcoesFiltroDefinicaoPolos } from './types'

export async function listarOpcoesFiltroDefinicaoPolos(): Promise<OpcoesFiltroDefinicaoPolos> {
  const { data } = await api.get<OpcoesFiltroDefinicaoPolos>(
    '/api/polos/opcoes-filtro/',
  )

  return data
}
