import { api } from '../api/http'

export async function checarDuplicidadeInscricaoEstudanteExterno(
  params: string,
) {
  const { data } = await api.get<{ possui_inscricao: boolean }>(
    '/api/v1/inscricoes/verificar-cpf-participante/',
    {
      params: {
        cpf_participante: params,
      },
    },
  )

  return data
}
