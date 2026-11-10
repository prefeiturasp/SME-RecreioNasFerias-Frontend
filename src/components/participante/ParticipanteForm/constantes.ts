export const TIPO_ESTUDANTE_REDE = 'ESTUDANTE_DA_REDE'
export const TIPO_ESTUDANTE_EXTERNO = 'ESTUDANTE_EXTERNO'
export const IDADE_MINIMA_INVALIDA = 15
export const MENSAGEM_IDADE_FORA_DA_FAIXA =
  'A data de nascimento informada excede a faixa etária permitida para participação no Recreio nas Férias.'
export const MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE =
  'Já existe uma inscrição com o CPF do participante informado para a edição vigente.'

const GRUPOS_ESTUDANTE_DA_REDE = [
  'BERCARIO_I',
  'BERCARIO_II',
  'MINI_GRUPO_I',
  'MINI_GRUPO_II',
] as const

export function grupoExigeEstudanteDaRede(grupo: string) {
  return (GRUPOS_ESTUDANTE_DA_REDE as readonly string[]).includes(grupo)
}
