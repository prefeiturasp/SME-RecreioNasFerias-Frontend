import { describe, expect, it } from 'vitest'
import formSchema, { calcularTotalInscritos } from './schema'

const dadosValidos = {
  projecaoInscritos: '10',
  pontoFocalNome: 'Ponto Focal Teste',
  pontoFocalTelefone: '(11) 99999-9999',
  pontoFocalEmail: 'ponto.focal@teste.com',
}

function mensagensDeErro(dados: typeof dadosValidos) {
  const resultado = formSchema.safeParse(dados)
  if (resultado.success) return []
  return resultado.error.issues.map((issue) => issue.message)
}

describe('DefinicaoPoloForm schema', () => {
  it('aceita quando os campos editáveis são válidos', () => {
    expect(formSchema.safeParse(dadosValidos).success).toBe(true)
  })

  it('aceita ponto focal vazio', () => {
    expect(
      formSchema.safeParse({
        projecaoInscritos: '0',
        pontoFocalNome: '',
        pontoFocalTelefone: '',
        pontoFocalEmail: '',
      }).success,
    ).toBe(true)
  })

  it('rejeita projeção de inscritos vazia', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        projecaoInscritos: '',
      }),
    ).toContain('Projeção de inscritos é obrigatória')
  })

  it('rejeita projeção de inscritos inválida', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        projecaoInscritos: '10a',
      }),
    ).toContain('Informe uma projeção de inscritos válida.')
  })

  it('rejeita e-mail do ponto focal inválido', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        pontoFocalEmail: 'email-invalido',
      }),
    ).toContain('Digite um e-mail válido para o ponto focal.')
  })

  it('rejeita telefone do ponto focal incompleto', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        pontoFocalTelefone: '(11) 9999',
      }),
    ).toContain('Informe um telefone válido para o ponto focal.')
  })

  it('aceita telefone do ponto focal apenas com dígitos', () => {
    expect(
      formSchema.safeParse({
        ...dadosValidos,
        pontoFocalTelefone: '71992626598',
      }).success,
    ).toBe(true)
  })
})

describe('calcularTotalInscritos', () => {
  it('aplica 30% e arredonda para baixo', () => {
    expect(calcularTotalInscritos(10)).toBe(13)
    expect(calcularTotalInscritos(11)).toBe(14)
  })

  it('retorna 0 para valores inválidos', () => {
    expect(calcularTotalInscritos(Number.NaN)).toBe(0)
    expect(calcularTotalInscritos(-1)).toBe(0)
  })
})
