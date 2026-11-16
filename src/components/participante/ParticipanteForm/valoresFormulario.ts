import type { FormValues } from './schema'
import type {
  InscricaoDetalhe,
  OpcaoChoice,
  ValoresChoicesInscricao,
} from '@/services/inscricao/types'

function respostaSimNao(valor: boolean): 'sim' | 'nao' {
  return valor ? 'sim' : 'nao'
}

function respostaSimNaoOpcional(
  valor: boolean | null,
): FormValues['podeIrEmboraSozinho'] {
  if (valor === null) return ''
  return valor ? 'sim' : 'nao'
}

function opcoesDosValores(valores: string[], opcoes: OpcaoChoice[]) {
  return valores.map((valor) => {
    const opcao = opcoes.find((item) => item.value === valor)
    return { value: valor, label: opcao?.label ?? valor }
  })
}

function tipoEscolaDaInscricao(
  valor: InscricaoDetalhe['tipo_escola'],
): FormValues['tipoEscola'] {
  if (valor === 'ESTADUAL' || valor === 'PARTICULAR') return valor
  return ''
}

export function valoresFormularioDaInscricao(
  inscricao: InscricaoDetalhe,
  choices: ValoresChoicesInscricao | undefined,
): FormValues {
  return {
    grupo: inscricao.grupo,
    tipoEstudante: inscricao.tipo_estudante,
    codigoEol: inscricao.codigo_eol,
    cpf: inscricao.cpf,
    cpf_participante: inscricao.cpf_participante,
    possuiInscricaoCpfParticipante: false,
    possuiInscricaoEolParticipante: false,
    nomeCompleto: inscricao.nome_participante,
    dataNascimento: inscricao.data_nascimento ?? '',
    nomeResponsavel: inscricao.responsavel_nome,
    nomeSocialResponsavel: inscricao.responsavel_nome_social,
    cep: inscricao.cep,
    logradouro: inscricao.logradouro,
    tipoLogradouro: inscricao.tipo_logradouro,
    numero: inscricao.numero,
    complemento: inscricao.complemento,
    bairro: inscricao.bairro,
    cidade: inscricao.cidade,
    telefone1: inscricao.telefone_contato_1,
    telefone2: inscricao.telefone_contato_2,
    email: inscricao.email,
    dreCodigoEol: inscricao.dre_codigo_eol,
    polo: inscricao.polo?.uuid ?? '',
    criancaComDeficiencia: respostaSimNao(inscricao.possui_deficiencia),
    qualDeficiencia: opcoesDosValores(
      inscricao.deficiencias,
      choices?.deficiencias ?? [],
    ),
    outraDeficiencia: inscricao.outra_deficiencia,
    criancaComProblemaSaude: respostaSimNao(inscricao.possui_problema_saude),
    qualProblemaSaude: opcoesDosValores(
      inscricao.problemas_saude,
      choices?.problemas_saude ?? [],
    ),
    outroProblemaSaude: inscricao.outro_problema_saude,
    medicacaoTratamentoContinuo: respostaSimNao(
      inscricao.usuario_medicacao_ou_tratamento_continuo,
    ),
    qualMedicacaoTratamentoContinuo: inscricao.medicacao_ou_tratamento_continuo,
    restricaoMedicamentoProntoAtendimento: respostaSimNao(
      inscricao.possui_restricao_medicamento_pronto_atendimento,
    ),
    qualRestricaoMedicamentoProntoAtendimento:
      inscricao.restricao_medicamento_pronto_atendimento,
    temConvenioMedico: respostaSimNao(inscricao.possui_convenio_medico),
    qualConvenioMedico: inscricao.convenio_medico,
    unidadeEducacional: inscricao.unidade_educacional,
    unidadeEducacionalCodigoEol: inscricao.unidade_educacional_codigo_eol,
    unidadeEducacionalTipo: inscricao.unidade_educacional_tipo,
    nomeTurma: inscricao.nome_turma,
    ano: inscricao.ano,
    podeIrEmboraSozinho: respostaSimNaoOpcional(
      inscricao.pode_ir_embora_sozinho,
    ),
    responsavelRetirada: inscricao.responsavel_retirada,
    autorizaUsoPiscina: respostaSimNaoOpcional(inscricao.autoriza_uso_piscina),
    tipoEscola: tipoEscolaDaInscricao(inscricao.tipo_escola),
  }
}
