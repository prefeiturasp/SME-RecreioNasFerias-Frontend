import { EDICOES_PROGRAMA_MOCK } from './mocks'
import type { EdicaoPrograma, NovaEdicaoPrograma } from './types'

const EDICOES_PROGRAMA_STORAGE_KEY = 'sme-recreio-edicoes-programa'

function ehEdicaoProgramaValida(valor: unknown): valor is EdicaoPrograma {
  if (!valor || typeof valor !== 'object') return false

  const edicao = valor as EdicaoPrograma

  return (
    typeof edicao.id === 'string' &&
    typeof edicao.nome === 'string' &&
    typeof edicao.dataInicioEdicao === 'string' &&
    typeof edicao.dataFimEdicao === 'string' &&
    typeof edicao.dataInicioInscricoes === 'string' &&
    typeof edicao.dataFimInscricoes === 'string' &&
    typeof edicao.quantidadeInscritos === 'number' &&
    typeof edicao.quantidadeAtendimentoEfetivo === 'number'
  )
}

function persistirEdicoes(edicoes: EdicaoPrograma[]): void {
  localStorage.setItem(EDICOES_PROGRAMA_STORAGE_KEY, JSON.stringify(edicoes))
}

function obterEdicoesSalvas(): EdicaoPrograma[] {
  const bruto = localStorage.getItem(EDICOES_PROGRAMA_STORAGE_KEY)
  if (!bruto) return []

  try {
    const edicoes = JSON.parse(bruto) as unknown
    if (!Array.isArray(edicoes)) return []

    return edicoes.filter(ehEdicaoProgramaValida)
  } catch {
    return []
  }
}

function inicializarEdicoesMock(): EdicaoPrograma[] {
  persistirEdicoes(EDICOES_PROGRAMA_MOCK)
  return [...EDICOES_PROGRAMA_MOCK]
}

export function listarEdicoesPrograma(): EdicaoPrograma[] {
  const edicoes = obterEdicoesSalvas()
  if (edicoes.length > 0) return edicoes

  return inicializarEdicoesMock()
}

export function adicionarEdicaoPrograma(
  novaEdicao: NovaEdicaoPrograma,
): EdicaoPrograma {
  const edicoes = listarEdicoesPrograma()
  const edicao: EdicaoPrograma = {
    id: crypto.randomUUID(),
    ...novaEdicao,
  }

  persistirEdicoes([...edicoes, edicao])

  return edicao
}

export function limparEdicoesPrograma(): void {
  localStorage.removeItem(EDICOES_PROGRAMA_STORAGE_KEY)
}
