import type { EdicaoPrograma } from './types'

function lerQuantidade(valor: unknown): number | null {
  if (valor === null) return 0
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor
  return null
}

export function interpretarItemEdicaoPrograma(
  dados: unknown,
): EdicaoPrograma | null {
  if (!dados || typeof dados !== 'object') return null

  const item = dados as Record<string, unknown>
  const quantidadeInscritos = lerQuantidade(item.quantidade_inscritos)
  const quantidadeAtendimentoEfetivo = lerQuantidade(
    item.quantidade_atendimento_efetivo,
  )
  const quantidadePasseios = lerQuantidade(item.quantidade_passeios)
  const quantidadeApresentacoes = lerQuantidade(item.quantidade_apresentacoes)

  if (
    typeof item.uuid !== 'string' ||
    typeof item.nome !== 'string' ||
    typeof item.data_inicio !== 'string' ||
    typeof item.data_fim !== 'string' ||
    typeof item.inscricoes_inicio !== 'string' ||
    typeof item.inscricoes_fim !== 'string' ||
    quantidadeInscritos === null ||
    quantidadeAtendimentoEfetivo === null ||
    quantidadePasseios === null ||
    quantidadeApresentacoes === null
  ) {
    return null
  }

  return {
    id: item.uuid,
    nome: item.nome,
    dataInicioEdicao: item.data_inicio,
    dataFimEdicao: item.data_fim,
    dataInicioInscricoes: item.inscricoes_inicio,
    dataFimInscricoes: item.inscricoes_fim,
    quantidadeInscritos,
    quantidadeAtendimentoEfetivo,
    quantidadePasseios,
    quantidadeApresentacoes,
  }
}
