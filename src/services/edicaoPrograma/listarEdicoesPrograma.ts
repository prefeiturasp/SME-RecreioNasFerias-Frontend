import { api } from '../api/http'
import type { EdicaoPrograma } from './types'

export async function listarEdicoesPrograma(): Promise<EdicaoPrograma[]> {
  const { data } = await api.get<EdicaoPrograma[]>('/api/v1/edicoes/')
  return data
}
