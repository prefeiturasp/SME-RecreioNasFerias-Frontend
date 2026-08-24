import type { EdicaoPrograma } from './types'

type PeriodoApi = {
  de: string
  ate: string
}

type EdicaoProgramaApi = {
  id: string
  nome: string
  periodoEdicao: PeriodoApi
  periodoInscricoes: PeriodoApi
  quantidadeInscritos: number | null
  quantidadeAtendimentoEfetivo: number | null
  quantidadePasseios?: number | null
  quantidadeApresentacoes?: number | null
}

function ehPeriodoValido(valor: unknown): valor is PeriodoApi {
  if (!valor || typeof valor !== 'object') return false

  const periodo = valor as PeriodoApi

  return typeof periodo.de === 'string' && typeof periodo.ate === 'string'
}

function ehEdicaoProgramaApiValida(valor: unknown): valor is EdicaoProgramaApi {
  if (!valor || typeof valor !== 'object') return false

  const edicao = valor as EdicaoProgramaApi

  return (
    typeof edicao.id === 'string' &&
    typeof edicao.nome === 'string' &&
    ehPeriodoValido(edicao.periodoEdicao) &&
    ehPeriodoValido(edicao.periodoInscricoes) &&
    (edicao.quantidadeInscritos === null ||
      typeof edicao.quantidadeInscritos === 'number') &&
    (edicao.quantidadeAtendimentoEfetivo === null ||
      typeof edicao.quantidadeAtendimentoEfetivo === 'number')
  )
}

function mapearEdicaoPrograma(edicao: EdicaoProgramaApi): EdicaoPrograma {
  return {
    id: edicao.id,
    nome: edicao.nome,
    dataInicioEdicao: edicao.periodoEdicao.de,
    dataFimEdicao: edicao.periodoEdicao.ate,
    dataInicioInscricoes: edicao.periodoInscricoes.de,
    dataFimInscricoes: edicao.periodoInscricoes.ate,
    quantidadeInscritos: edicao.quantidadeInscritos ?? 0,
    quantidadeAtendimentoEfetivo: edicao.quantidadeAtendimentoEfetivo ?? 0,
    quantidadePasseios: edicao.quantidadePasseios ?? 0,
    quantidadeApresentacoes: edicao.quantidadeApresentacoes ?? 0,
  }
}

export function interpretarRespostaEdicaoPrograma(
  dados: unknown,
): EdicaoPrograma | null {
  if (!ehEdicaoProgramaApiValida(dados)) return null

  return mapearEdicaoPrograma(dados)
}

