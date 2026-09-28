import {
  PERGUNTAS_SAUDE,
  RESPOSTA_SIM,
} from '@/components/participante/ParticipanteForm/constantes'
import type { FormValues } from '@/components/participante/ParticipanteForm/schema'

const CAMPOS_OBRIGATORIOS = [
  'agrupamento',
  'tipoEstudante',
  'codigoEol',
  'cpf',
  'nomeCompleto',
  'dataNascimento',
  'nomeResponsavel',
  'cep',
  'logradouro',
  'numero',
  'bairro',
  'cidade',
  'telefone1',
  'email',
  'dreCodigoEol',
  'polo',
  'grupoParticipante',
  'estaNaRede',
  'tipoEscola',
  'unidadeEducacional',
  'turmaAno',
  'podeIrSozinho',
  'responsavelRetirada',
  'autorizaPiscina',
] as const satisfies ReadonlyArray<keyof FormValues>

function preenchido(valor: string) {
  return valor.trim().length > 0
}

export function inscricaoEstaCompleta(dados: FormValues) {
  const camposPreenchidos = CAMPOS_OBRIGATORIOS.every((campo) =>
    preenchido(dados[campo]),
  )

  if (!camposPreenchidos) return false

  return PERGUNTAS_SAUDE.every((pergunta) => {
    if (!preenchido(dados[pergunta.name])) return false
    if (dados[pergunta.name] !== RESPOSTA_SIM) return true

    return preenchido(dados[pergunta.nameQual])
  })
}
