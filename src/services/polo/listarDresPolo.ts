import { api } from '../api/http'
import type { DrePolo } from './types'

export async function listarDresPolo(): Promise<DrePolo[]> {
  const { data } = await api.get<DrePolo[]>('/api/v1/polos/dres/')
  return data
}
