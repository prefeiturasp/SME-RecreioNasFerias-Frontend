const TEMPO_CACHE_VERIFICACAO_MS = 5 * 60 * 1000

let sessaoVerificadaEm: number | null = null

export function marcarSessaoVerificada(): void {
  sessaoVerificadaEm = Date.now()
}

export function invalidarCacheVerificacaoSessao(): void {
  sessaoVerificadaEm = null
}

export function sessaoVerificadaRecentemente(): boolean {
  if (sessaoVerificadaEm === null) return false

  return Date.now() - sessaoVerificadaEm < TEMPO_CACHE_VERIFICACAO_MS
}
