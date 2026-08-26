import { api } from '../api/http'
import type { EdicaoPrograma } from './types'

export async function obterEdicaoPrograma(
  uuid: string,
): Promise<EdicaoPrograma> {
  const { data } = await api.get<EdicaoPrograma>(`/api/v1/edicoes/${uuid}/`)
  return data
}
