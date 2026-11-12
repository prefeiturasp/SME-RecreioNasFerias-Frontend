import { z } from 'zod'

import { extrairDigitos } from '@/utils/mascarasEntrada'
import { calcularIdadeDetalhada } from '@/utils/calcularIdadeDetalhada'
import {
  IDADE_MINIMA_INVALIDA,
  MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
  MENSAGEM_IDADE_FORA_DA_FAIXA,
  MENSAGEM_INSCRICAO_EOL_EXISTENTE,
  TIPO_ESTUDANTE_EXTERNO,
  TIPO_ESTUDANTE_REDE,
} from './constantes'

const telefone = z
  .string()
  .trim()
  .refine((valor) => {
    if (valor === '') return true
    const quantidade = extrairDigitos(valor).length
    return quantidade === 10 || quantidade === 11
  }, 'Informe um telefone válido.')

export const formSchemaRascunho = z.object({
  grupo: z.string(),
  tipoEstudante: z.string(),
  codigoEol: z.string(),
  cpf: z.string().regex(/^(\d{11})?$/, 'Informe um CPF válido.'),
  cpf_participante: z.string().regex(/^(\d{11})?$/, 'Informe um CPF válido.'),
  possuiInscricaoCpfParticipante: z.boolean(),
  possuiInscricaoEolParticipante: z.boolean(),
  nomeCompleto: z.string(),
  dataNascimento: z.string(),
  nomeResponsavel: z.string(),
  nomeSocialResponsavel: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  tipoLogradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  telefone1: telefone,
  telefone2: telefone,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.union([z.literal(''), z.email({ error: 'Digite um e-mail válido.' })]),
    ),
  dreCodigoEol: z.string(),
  polo: z.string(),
  criancaComDeficiencia: z.enum(['sim', 'nao', '']),
  qualDeficiencia: z.array(z.object({ value: z.string(), label: z.string() })),
  outraDeficiencia: z.string(),
  criancaComProblemaSaude: z.enum(['sim', 'nao', '']),
  qualProblemaSaude: z.array(
    z.object({ value: z.string(), label: z.string() }),
  ),
  outroProblemaSaude: z.string().max(300),
  medicacaoTratamentoContinuo: z.enum(['sim', 'nao', '']),
  qualMedicacaoTratamentoContinuo: z.string(),
  restricaoMedicamentoProntoAtendimento: z.enum(['sim', 'nao', '']),
  qualRestricaoMedicamentoProntoAtendimento: z.string(),
  temConvenioMedico: z.enum(['sim', 'nao', '']),
  qualConvenioMedico: z.string(),
  unidadeEducacional: z.string(),
  unidadeEducacionalCodigoEol: z.string(),
  unidadeEducacionalTipo: z.string(),
  nomeTurma: z.string(),
  ano: z.string(),
  podeIrEmboraSozinho: z.enum(['sim', 'nao', '']),
  responsavelRetirada: z.string(),
  autorizaUsoPiscina: z.enum(['sim', 'nao', '']),
  tipoEscola: z.enum(['ESTADUAL', 'PARTICULAR', '']),
})

type DadosFormulario = z.infer<typeof formSchemaRascunho>
type AdicionarCampoObrigatorio = (caminho: string, mensagem?: string) => void

function validarEstudanteExterno(
  dados: DadosFormulario,
  adicionarCampoObrigatorio: AdicionarCampoObrigatorio,
) {
  if (!dados.cpf_participante) {
    adicionarCampoObrigatorio('cpf_participante')
  } else if (!/^\d{11}$/.test(dados.cpf_participante)) {
    adicionarCampoObrigatorio('cpf_participante', 'Informe um CPF válido.')
  }

  if (dados.possuiInscricaoCpfParticipante) {
    adicionarCampoObrigatorio(
      'cpf_participante',
      MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
    )
  }

  const camposObrigatoriosEstudanteExterno = [
    'nomeCompleto',
    'dataNascimento',
    'cpf',
    'nomeResponsavel',
    'cep',
    'logradouro',
    'numero',
    'bairro',
    'cidade',
  ] as const

  for (const campo of camposObrigatoriosEstudanteExterno) {
    if (!dados[campo]) adicionarCampoObrigatorio(campo)
  }
}

function validarIdentificacao(
  dados: DadosFormulario,
  adicionarCampoObrigatorio: AdicionarCampoObrigatorio,
) {
  if (dados.tipoEstudante === TIPO_ESTUDANTE_EXTERNO) {
    validarEstudanteExterno(dados, adicionarCampoObrigatorio)
    return
  }

  if (dados.possuiInscricaoEolParticipante) {
    adicionarCampoObrigatorio('codigoEol', MENSAGEM_INSCRICAO_EOL_EXISTENTE)
  }

  const codigoEolValido = /^\d{6,7}$/.test(dados.codigoEol)
  const cpfValido = /^\d{11}$/.test(dados.cpf)

  if (!codigoEolValido && !cpfValido) {
    for (const caminho of ['codigoEol', 'cpf']) {
      adicionarCampoObrigatorio(caminho, 'Informe um CPF ou código EOL válido.')
    }
  }
}

const formSchema = formSchemaRascunho.superRefine((dados, contexto) => {
  const adicionarCampoObrigatorio = (
    caminho: string,
    mensagem = 'Este campo é obrigatório.',
  ) => {
    contexto.addIssue({
      code: 'custom',
      path: [caminho],
      message: mensagem,
    })
  }

  const idade = calcularIdadeDetalhada(dados.dataNascimento)
  if (idade && idade.anos >= IDADE_MINIMA_INVALIDA) {
    adicionarCampoObrigatorio('dataNascimento', MENSAGEM_IDADE_FORA_DA_FAIXA)
  }

  validarIdentificacao(dados, adicionarCampoObrigatorio)

  const camposObrigatorios = [
    {
      condicao: !dados.grupo,
      preenchido: Boolean(dados.grupo.trim()),
      caminho: 'grupo',
    },
    {
      condicao: !dados.tipoEstudante,
      preenchido: Boolean(dados.tipoEstudante.trim()),
      caminho: 'tipoEstudante',
    },
    {
      condicao: !dados.telefone1,
      preenchido: Boolean(dados.telefone1.trim()),
      caminho: 'telefone1',
    },
    {
      condicao: !dados.email,
      preenchido: Boolean(dados.email.trim()),
      caminho: 'email',
    },
    {
      condicao: !dados.dreCodigoEol,
      preenchido: Boolean(dados.dreCodigoEol.trim()),
      caminho: 'dreCodigoEol',
    },
    {
      condicao: !dados.polo,
      preenchido: Boolean(dados.polo.trim()),
      caminho: 'polo',
    },
    {
      condicao: !dados.criancaComDeficiencia,
      preenchido: false,
      caminho: 'criancaComDeficiencia',
    },
    {
      condicao: !dados.criancaComProblemaSaude,
      preenchido: false,
      caminho: 'criancaComProblemaSaude',
    },
    {
      condicao: !dados.medicacaoTratamentoContinuo,
      preenchido: false,
      caminho: 'medicacaoTratamentoContinuo',
    },
    {
      condicao: !dados.restricaoMedicamentoProntoAtendimento,
      preenchido: false,
      caminho: 'restricaoMedicamentoProntoAtendimento',
    },
    {
      condicao: !dados.temConvenioMedico,
      preenchido: false,
      caminho: 'temConvenioMedico',
    },
    {
      condicao: dados.criancaComDeficiencia === 'sim',
      preenchido: dados.qualDeficiencia.length > 0,
      caminho: 'qualDeficiencia',
    },
    {
      condicao: dados.criancaComProblemaSaude === 'sim',
      preenchido: dados.qualProblemaSaude.length > 0,
      caminho: 'qualProblemaSaude',
    },
    {
      condicao: dados.medicacaoTratamentoContinuo === 'sim',
      preenchido: Boolean(dados.qualMedicacaoTratamentoContinuo.trim()),
      caminho: 'qualMedicacaoTratamentoContinuo',
    },
    {
      condicao: dados.restricaoMedicamentoProntoAtendimento === 'sim',
      preenchido: Boolean(
        dados.qualRestricaoMedicamentoProntoAtendimento.trim(),
      ),
      caminho: 'qualRestricaoMedicamentoProntoAtendimento',
    },
    {
      condicao: dados.temConvenioMedico === 'sim',
      preenchido: Boolean(dados.qualConvenioMedico.trim()),
      caminho: 'qualConvenioMedico',
    },
    {
      condicao:
        dados.criancaComDeficiencia === 'sim' &&
        dados.qualDeficiencia.some((opcao) =>
          ['outro', 'outra'].includes(
            opcao.label.trim().toLocaleLowerCase('pt-BR'),
          ),
        ),
      preenchido: Boolean(dados.outraDeficiencia.trim()),
      caminho: 'outraDeficiencia',
    },
    {
      condicao:
        dados.criancaComProblemaSaude === 'sim' &&
        dados.qualProblemaSaude.some((opcao) =>
          ['outro', 'outra'].includes(
            opcao.label.trim().toLocaleLowerCase('pt-BR'),
          ),
        ),
      preenchido: Boolean(dados.outroProblemaSaude.trim()),
      caminho: 'outroProblemaSaude',
    },
    {
      condicao:
        dados.tipoEstudante === TIPO_ESTUDANTE_REDE &&
        !dados.podeIrEmboraSozinho,
      preenchido: false,
      caminho: 'podeIrEmboraSozinho',
    },
    {
      condicao: dados.tipoEstudante === TIPO_ESTUDANTE_REDE,
      preenchido: Boolean(dados.responsavelRetirada.trim()),
      caminho: 'responsavelRetirada',
    },
    {
      condicao:
        dados.tipoEstudante === TIPO_ESTUDANTE_REDE &&
        !dados.autorizaUsoPiscina,
      preenchido: false,
      caminho: 'autorizaUsoPiscina',
    },
    {
      condicao: dados.tipoEstudante === TIPO_ESTUDANTE_EXTERNO,
      preenchido: Boolean(dados.tipoEscola),
      caminho: 'tipoEscola',
    },
    {
      condicao: dados.tipoEstudante === TIPO_ESTUDANTE_EXTERNO,
      preenchido: Boolean(dados.unidadeEducacional.trim()),
      caminho: 'unidadeEducacional',
    },
    {
      condicao: dados.tipoEstudante === TIPO_ESTUDANTE_EXTERNO,
      preenchido: Boolean(dados.nomeTurma.trim()),
      caminho: 'nomeTurma',
    },
    {
      condicao: dados.tipoEstudante === TIPO_ESTUDANTE_EXTERNO,
      preenchido: Boolean(dados.ano.trim()),
      caminho: 'ano',
    },
  ]

  for (const { condicao, preenchido, caminho } of camposObrigatorios) {
    if (!condicao || preenchido) continue

    adicionarCampoObrigatorio(caminho)
  }
})

export type FormValues = z.infer<typeof formSchema>

export default formSchema
