import type { DadosCadastroEdicaoPrograma } from './types'

export function obterCampoTextoFormulario(
  dados: FormData,
  nomeCampo: string,
): string {
  const valor = dados.get(nomeCampo)
  return typeof valor === 'string' ? valor : ''
}

export function obterDadosFormularioEdicao(
  form: HTMLFormElement,
): DadosCadastroEdicaoPrograma {
  const dados = new FormData(form)

  return {
    nome: obterCampoTextoFormulario(dados, 'NomeDaEdicao'),
    dataInicioEdicao: obterCampoTextoFormulario(dados, 'DataInicioEdicao'),
    dataFimEdicao: obterCampoTextoFormulario(dados, 'DataFimEdicao'),
    dataInicioInscricoes: obterCampoTextoFormulario(
      dados,
      'DataInicioInscricoes',
    ),
    dataFimInscricoes: obterCampoTextoFormulario(dados, 'DataFimInscricoes'),
  }
}

export function dadosFormularioEdicaoSaoIguais(
  atual: DadosCadastroEdicaoPrograma,
  inicial: DadosCadastroEdicaoPrograma,
): boolean {
  return (
    atual.nome === inicial.nome &&
    atual.dataInicioEdicao === inicial.dataInicioEdicao &&
    atual.dataFimEdicao === inicial.dataFimEdicao &&
    atual.dataInicioInscricoes === inicial.dataInicioInscricoes &&
    atual.dataFimInscricoes === inicial.dataFimInscricoes
  )
}
