import { describe, expect, it } from 'vitest'
import formSchema from './schema'

const dadosValidos = {
  tipo: 'Pendente',
  nomeOsc: 'OSC Teste',
  nomePolo: 'Polo Teste',
  dre: 'DRE Butantã',
  tipoUe: 'EMEF',
  quantidadeMaximaAlunos: '50',
  cep: '01310-100',
  endereco: 'Av. Paulista, 1000',
  nomeGestor: 'Gestor Teste',
  emailPolo: 'polo@teste.com',
  telefonePolo: '(11) 99999-9999',
  status: 'ativo' as const,
  observacoes: '',
}

function mensagensDeErro(dados: typeof dadosValidos) {
  const resultado = formSchema.safeParse(dados)
  if (resultado.success) return []
  return resultado.error.issues.map((issue) => issue.message)
}

describe('PoloForm schema', () => {
  it('aceita quando os campos obrigatórios são válidos', () => {
    expect(formSchema.safeParse(dadosValidos).success).toBe(true)
  })

  it('rejeita nome da OSC composto só por espaços', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        nomeOsc: '   ',
      }),
    ).toContain('Nome da OSC é obrigatório')
  })

  it('rejeita quantidade máxima de alunos vazia', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        quantidadeMaximaAlunos: '',
      }),
    ).toContain('Quantidade máxima de alunos é obrigatória')
  })

  it('rejeita quantidade máxima de alunos inválida', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        quantidadeMaximaAlunos: '0',
      }),
    ).toContain('Informe uma quantidade máxima de alunos válida.')
  })

  it('rejeita e-mail inválido', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        emailPolo: 'email-invalido',
      }),
    ).toContain('Informe um e-mail válido para o polo.')
  })

  it('rejeita CEP incompleto', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        cep: '01310',
      }),
    ).toContain('Informe um CEP válido.')
  })

  it('rejeita telefone incompleto', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        telefonePolo: '(11) 9999',
      }),
    ).toContain('Informe um telefone válido para o polo.')
  })

  it('rejeita status inválido', () => {
    expect(
      mensagensDeErro({
        ...dadosValidos,
        status: 'pendente' as 'ativo',
      }),
    ).toContain('Selecione um status válido.')
  })

  it('aceita observações vazias', () => {
    expect(
      formSchema.safeParse({
        ...dadosValidos,
        observacoes: '',
      }).success,
    ).toBe(true)
  })
})
