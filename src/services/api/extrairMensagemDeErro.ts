const CHAVES_MENSAGEM_ERRO_API = ['detalhe', 'error', 'detail'] as const

export function extrairMensagemDeErroDeDados(dados: unknown): string | null {
  if (typeof dados === 'string' && dados.trim().length > 0) {
    return dados
  }

  if (!dados || typeof dados !== 'object') {
    return null
  }

  for (const chave of CHAVES_MENSAGEM_ERRO_API) {
    const valor = (dados as Record<string, unknown>)[chave]
    if (typeof valor === 'string' && valor.trim().length > 0) {
      return valor
    }
  }

  return null
}

type ErroComResposta = {
  response?: {
    data?: unknown
  }
}

export function extrairMensagemDeErro(error: unknown): string {
  const dados = (error as ErroComResposta)?.response?.data
  return extrairMensagemDeErroDeDados(dados) ?? ''
}
