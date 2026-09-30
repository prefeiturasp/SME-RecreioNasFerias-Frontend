export const TIPO_ESTUDANTE_REDE = 'ESTUDANTE_DA_REDE'

const GRUPOS_ESTUDANTE_DA_REDE = [
  'BERCARIO_I',
  'BERCARIO_II',
  'MINI_GRUPO_I',
  'MINI_GRUPO_II',
] as const

export function grupoExigeEstudanteDaRede(grupo: string) {
  return (GRUPOS_ESTUDANTE_DA_REDE as readonly string[]).includes(grupo)
}
