export const AGRUPAMENTO_BERCARIO = 'Berçário'
export const AGRUPAMENTO_MINI_GRUPO = 'Mini Grupo I e II'
export const AGRUPAMENTO_QUATRO_A_QUATORZE = '4 a 14 anos'

export const TIPO_ESTUDANTE_REDE = 'ESTUDANTE_DA_REDE'
export const TIPO_ESTUDANTE_FORA_DA_REDE = 'ESTUDANTE_EXTERNO'

export const ROTULO_TIPO_ESTUDANTE_REDE = 'Estudante da Rede'
export const ROTULO_TIPO_ESTUDANTE_FORA_DA_REDE = 'Fora da Rede'

export const GRUPO_BERCARIO_I = 'BERCARIO_I'
export const GRUPO_BERCARIO_II = 'BERCARIO_II'
export const GRUPO_MINI_GRUPO_I = 'MINI_GRUPO_I'
export const GRUPO_MINI_GRUPO_II = 'MINI_GRUPO_II'
export const GRUPO_QUATRO_A_14_ANOS = 'QUATRO_A_14_ANOS'

export const OPCOES_AGRUPAMENTO = [
  { value: AGRUPAMENTO_BERCARIO, label: AGRUPAMENTO_BERCARIO },
  { value: AGRUPAMENTO_MINI_GRUPO, label: AGRUPAMENTO_MINI_GRUPO },
  {
    value: AGRUPAMENTO_QUATRO_A_QUATORZE,
    label: AGRUPAMENTO_QUATRO_A_QUATORZE,
  },
]

export const OPCOES_TIPO_ESTUDANTE = [
  { value: TIPO_ESTUDANTE_REDE, label: ROTULO_TIPO_ESTUDANTE_REDE },
  {
    value: TIPO_ESTUDANTE_FORA_DA_REDE,
    label: ROTULO_TIPO_ESTUDANTE_FORA_DA_REDE,
  },
]

export const OPCOES_GRUPO_PARTICIPANTE = [
  { value: GRUPO_BERCARIO_I, label: 'Berçário I' },
  { value: GRUPO_BERCARIO_II, label: 'Berçário II' },
  { value: GRUPO_MINI_GRUPO_I, label: 'Mini Grupo I' },
  { value: GRUPO_MINI_GRUPO_II, label: 'Mini Grupo II' },
  { value: GRUPO_QUATRO_A_14_ANOS, label: '4 a 14 anos' },
]

export const ESTA_NA_REDE_SIM = 'Sim'

export const OPCOES_SIM_NAO = [
  { value: ESTA_NA_REDE_SIM, label: ESTA_NA_REDE_SIM },
  { value: 'Não', label: 'Não' },
]

export const OPCOES_TIPO_ESCOLA = [
  { value: 'Estadual', label: 'Estadual' },
  { value: 'Particular', label: 'Particular' },
]

export const RESPOSTA_SIM = 'Sim'

export const LIMITE_ANEXO_BYTES = 10 * 1024 * 1024

export const PERGUNTAS_SAUDE = [
  {
    name: 'criancaDeficiencia',
    nameQual: 'criancaDeficienciaQual',
    pergunta: 'Criança com deficiência?',
    tipoQual: 'select',
    opcoes: [],
  },
  {
    name: 'problemaSaude',
    nameQual: 'problemaSaudeQual',
    pergunta: 'Criança com problema de saúde?',
    tipoQual: 'select',
    opcoes: [],
  },
  {
    name: 'medicacao',
    nameQual: 'medicacaoQual',
    pergunta: 'Medicação/tratamento contínuo?',
    tipoQual: 'select',
    opcoes: [],
  },
  {
    name: 'restricaoMedicamento',
    nameQual: 'restricaoMedicamentoQual',
    pergunta: 'Restrição a medicamento em pronto atendimento?',
    tipoQual: 'select',
    opcoes: [],
  },
  {
    name: 'convenioMedico',
    nameQual: 'convenioMedicoQual',
    pergunta: 'Tem convênio médico?',
    tipoQual: 'texto',
  },
] as const
