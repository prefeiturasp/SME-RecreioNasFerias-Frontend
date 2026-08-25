import { api } from '../api/http'
import { interpretarItemEdicaoPrograma } from './interpretarItemEdicaoPrograma'
import type { DadosCadastroEdicaoPrograma, EdicaoPrograma } from './types'

type PayloadAtualizacaoEdicaoPrograma = {
  nome: string
  data_inicio: string
  data_fim: string
  inscricoes_inicio: string
  inscricoes_fim: string
}

function montarPayloadEdicao(
  dados: DadosCadastroEdicaoPrograma,
): PayloadAtualizacaoEdicaoPrograma {
  return {
    nome: dados.nome,
    data_inicio: dados.dataInicioEdicao,
    data_fim: dados.dataFimEdicao,
    inscricoes_inicio: dados.dataInicioInscricoes,
    inscricoes_fim: dados.dataFimInscricoes,
  }
}

function rotaAtualizarEdicao(uuid: string) {
  return `/api/v1/edicoes/${uuid}/`
}

export async function atualizarEdicaoPrograma(
  uuid: string,
  dados: DadosCadastroEdicaoPrograma,
): Promise<EdicaoPrograma> {
  const { data } = await api.put(
    rotaAtualizarEdicao(uuid),
    montarPayloadEdicao(dados),
  )

  const edicao = interpretarItemEdicaoPrograma(data as unknown)

  if (!edicao) {
    throw new Error()
  }

  return edicao
}
