export type ConfiguracaoRuntime = {
  VITE_API_BASE_URL?: string
  VITE_SME_INTEGRACAO_API_BASE_URL?: string
  VITE_SME_INTEGRACAO_API_KEY?: string
}

declare global {
  interface Window {
    __ENV__?: ConfiguracaoRuntime
  }
}

type NomeVariavelAmbiente = keyof ConfiguracaoRuntime

const PLACEHOLDER_VARIAVEL_AMBIENTE = /^\$\{[A-Z0-9_]+\}$/

function valorRuntimeValido(valor: string): boolean {
  const normalizado = valor.trim()
  return (
    normalizado.length > 0 && !PLACEHOLDER_VARIAVEL_AMBIENTE.test(normalizado)
  )
}

function obterValorVariavelAmbiente(nome: NomeVariavelAmbiente): string {
  const runtime = window.__ENV__?.[nome]
  if (typeof runtime === 'string' && valorRuntimeValido(runtime)) {
    return runtime.trim()
  }

  const build = import.meta.env[nome]
  if (typeof build === 'string' && build.trim().length > 0) {
    return build.trim()
  }

  return ''
}

export function obterApiBaseUrl(): string {
  return obterValorVariavelAmbiente('VITE_API_BASE_URL')
}

export function obterSmeIntegracaoApiBaseUrl(): string {
  return obterValorVariavelAmbiente('VITE_SME_INTEGRACAO_API_BASE_URL')
}

export function obterSmeIntegracaoApiKey(): string {
  return obterValorVariavelAmbiente('VITE_SME_INTEGRACAO_API_KEY')
}
