import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  AGRUPAMENTO_BERCARIO,
  AGRUPAMENTO_MINI_GRUPO,
  ESTA_NA_REDE_SIM,
  OPCOES_AGRUPAMENTO,
  OPCOES_GRUPO_PARTICIPANTE,
  OPCOES_SIM_NAO,
  OPCOES_TIPO_ESCOLA,
  OPCOES_TIPO_ESTUDANTE,
  PERGUNTAS_SAUDE,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
import { AnexoDocumentos } from './AnexoDocumentos'
import { PerguntaSaude } from './PerguntaSaude'
import type { FormValues } from './schema'
import formSchema from './schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { ChevronDownIcon } from '@/components/icons'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { FormFieldLeitura } from '@/components/ui/form-field-leitura'
import { FormFieldEol } from '@/components/ui/form-field-eol'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetPolos } from '@/hooks/useGetPolos'
import { calcularIdade } from '@/utils/calcularIdade'
import { inscricaoEstaCompleta } from '@/utils/inscricaoEstaCompleta'
import { useToast } from '@/hooks/useToast'

const SECOES_FORMULARIO = [
  {
    id: 'informacoes-basicas',
    titulo: 'Informações Básicas',
    aberta: true,
  },
  {
    id: 'informacoes-por-grupo',
    titulo: 'Informações por Grupo',
    aberta: false,
  },
  {
    id: 'informacoes-de-saude',
    titulo: 'Informações de Saúde',
    aberta: false,
  },
] as const

type ParticipanteFormProps = {
  onBuscarCodigoEol?: (codigoEol: string) => void
  onBuscarCpf?: (cpf: string) => void
}

export function ParticipanteForm({
  onBuscarCodigoEol,
  onBuscarCpf,
}: ParticipanteFormProps = {}) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agrupamento: '',
      tipoEstudante: '',
      codigoEol: '',
      cpf: '',
      nomeCompleto: '',
      dataNascimento: '',
      nomeResponsavel: '',
      nomeSocialResponsavel: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      telefone1: '',
      telefone2: '',
      email: '',
      dreCodigoEol: '',
      polo: '',
      grupoParticipante: '',
      estaNaRede: '',
      tipoEscola: '',
      unidadeEducacional: '',
      turmaAno: '',
      podeIrSozinho: '',
      responsavelRetirada: '',
      autorizaPiscina: '',
      criancaDeficiencia: '',
      criancaDeficienciaQual: '',
      problemaSaude: '',
      problemaSaudeQual: '',
      medicacao: '',
      medicacaoQual: '',
      restricaoMedicamento: '',
      restricaoMedicamentoQual: '',
      convenioMedico: '',
      convenioMedicoQual: '',
    },
  })
  const agrupamento = useWatch({
    control: form.control,
    name: 'agrupamento',
  })
  const tipoEstudante = useWatch({
    control: form.control,
    name: 'tipoEstudante',
  })
  const dreCodigoEol = useWatch({
    control: form.control,
    name: 'dreCodigoEol',
  })
  const dataNascimento = useWatch({
    control: form.control,
    name: 'dataNascimento',
  })
  const idade = useMemo(() => {
    const anos = calcularIdade(dataNascimento)
    if (!anos) return ''
    return anos === '1' ? '1 ano' : `${anos} anos`
  }, [dataNascimento])
  const dresQuery = useGetDres()
  const polosQuery = useGetPolos(
    undefined,
    dreCodigoEol,
    undefined,
    1,
    50,
    undefined,
    Boolean(dreCodigoEol),
  )
  const dres = dresQuery.data ?? []
  const polos = polosQuery.data?.results ?? []
  const tipoTravado =
    agrupamento === AGRUPAMENTO_BERCARIO ||
    agrupamento === AGRUPAMENTO_MINI_GRUPO
  const rotuloTipoEstudante = useMemo(
    () =>
      OPCOES_TIPO_ESTUDANTE.find((opcao) => opcao.value === tipoEstudante)
        ?.label ?? '',
    [tipoEstudante],
  )
  const secoesLiberadas = Boolean(agrupamento) && Boolean(tipoEstudante)

  useEffect(() => {
    if (!agrupamento) return

    form.setValue('tipoEstudante', tipoTravado ? TIPO_ESTUDANTE_REDE : '')
    form.setValue('grupoParticipante', '')
    form.setValue('tipoEscola', '')
    form.setValue('podeIrSozinho', '')
    form.setValue('responsavelRetirada', '')
    form.setValue('autorizaPiscina', '')
  }, [agrupamento, form, tipoTravado])

  useEffect(() => {
    form.setValue(
      'estaNaRede',
      tipoEstudante === TIPO_ESTUDANTE_REDE ? ESTA_NA_REDE_SIM : '',
    )
  }, [tipoEstudante, form])

  useEffect(() => {
    form.setValue('polo', '')
  }, [dreCodigoEol, form])

  function avisarRascunho() {
    showToast({
      id: 'inscricao-rascunho',
      title: 'Rascunho salvo',
      description: 'A inscrição foi salva como rascunho.',
    })
  }

  function salvarRascunho() {
    void form.handleSubmit(() => {
      avisarRascunho()
    })()
  }

  function salvar() {
    void form.handleSubmit((dados) => {
      if (!inscricaoEstaCompleta(dados)) {
        avisarRascunho()
        return
      }

      showToast({
        id: 'inscricao-completa',
        title: 'Inscrição realizada',
        description: 'O participante foi inscrito.',
      })
    })()
  }

  return (
    <form
      noValidate
      aria-label="Formulário de cadastro de participante"
      onSubmit={form.handleSubmit(() => undefined)}
      className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
    >
      <FieldGroup className="gap-8">
        <Alert className="h-36 max-h-36 overflow-y-auto rounded-sm border-0 bg-[#c5d4d2] px-8 py-6">
          <AlertDescription className="text-sm text-foreground">
            Usuário deve visualizar texto com orientações que precisa
            compartilhar com familiares e responsáveis.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-4">
          {SECOES_FORMULARIO.filter(
            (secao) => secao.id === 'informacoes-basicas' || secoesLiberadas,
          ).map((secao) => (
            <div
              key={secao.id}
              className="flex overflow-hidden rounded-sm border border-gray-300"
            >
              <span
                aria-hidden="true"
                className="w-2.5 shrink-0 bg-brand-dark"
              />
              <Collapsible
                className="group min-w-0 flex-1"
                defaultOpen={secao.aberta}
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-5 py-3 text-left data-[state=open]:border-b data-[state=open]:border-gray-300"
                  >
                    <span className="grow font-semibold text-brand-dark">
                      {secao.titulo}
                    </span>
                    <span className="shrink-0 text-sm font-normal text-muted-foreground">
                      <span className="text-destructive">*</span> Campos
                      obrigatórios
                    </span>
                    <ChevronDownIcon className="size-6 shrink-0 text-brand-dark transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 py-4">
                  {secao.id === 'informacoes-basicas' ? (
                    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
                      <AlertaErroApi
                        erro={dresQuery.error ?? polosQuery.error}
                        className="lg:col-span-2"
                      />
                      <FormField
                        control={form.control}
                        name="agrupamento"
                        label={
                          <>
                            <span className="text-destructive">*</span> Tipo de
                            agrupamento
                          </>
                        }
                        type="select"
                        options={OPCOES_AGRUPAMENTO}
                        placeholder="Selecione o tipo de agrupamento"
                      />
                      {agrupamento && tipoTravado ? (
                        <FormFieldLeitura
                          id="tipoEstudante"
                          label={
                            <>
                              <span className="text-destructive">*</span> Tipo
                              de estudante
                            </>
                          }
                          value={rotuloTipoEstudante}
                        />
                      ) : null}
                      {agrupamento && !tipoTravado ? (
                        <FormField
                          control={form.control}
                          name="tipoEstudante"
                          label={
                            <>
                              <span className="text-destructive">*</span> Tipo
                              de estudante
                            </>
                          }
                          type="select"
                          options={OPCOES_TIPO_ESTUDANTE}
                          placeholder="Selecione o tipo de estudante"
                        />
                      ) : null}
                      <FormFieldEol
                        control={form.control}
                        name="codigoEol"
                        label={
                          <>
                            <span className="text-destructive">*</span> Código
                            EOL
                          </>
                        }
                        placeholder="Código EOL"
                        buscaInterna
                        onSearch={onBuscarCodigoEol}
                      />
                      <FormFieldEol
                        control={form.control}
                        name="cpf"
                        label={
                          <>
                            <span className="text-destructive">*</span> CPF
                          </>
                        }
                        placeholder="Digite o CPF"
                        buscaInterna
                        maxLength={11}
                        rotuloBusca="CPF"
                        onSearch={onBuscarCpf}
                      />
                      <FormField
                        control={form.control}
                        name="nomeCompleto"
                        label={
                          <>
                            <span className="text-destructive">*</span> Nome
                            completo do(a) participante
                          </>
                        }
                        placeholder="Nome completo do(a) participante"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        label={
                          <>
                            <span className="text-destructive">*</span> Data de
                            nascimento
                          </>
                        }
                        placeholder="DD/MM/AAAA"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="nomeResponsavel"
                        label={
                          <>
                            <span className="text-destructive">*</span> Nome
                            completo do responsável
                          </>
                        }
                        placeholder="Nome Completo do Responsável"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="nomeSocialResponsavel"
                        label="Nome social do(a) responsável"
                        placeholder="Nome Social do(a) Responsável"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="cep"
                        label={
                          <>
                            <span className="text-destructive">*</span> CEP
                          </>
                        }
                        placeholder="CEP"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="logradouro"
                        label={
                          <>
                            <span className="text-destructive">*</span>{' '}
                            Logradouro
                          </>
                        }
                        placeholder="Logradouro"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="numero"
                        label={
                          <>
                            <span className="text-destructive">*</span> Número
                          </>
                        }
                        placeholder="Número"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="complemento"
                        label="Complemento"
                        placeholder="Complemento"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="bairro"
                        label={
                          <>
                            <span className="text-destructive">*</span> Bairro
                          </>
                        }
                        placeholder="Bairro"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="cidade"
                        label={
                          <>
                            <span className="text-destructive">*</span> Cidade
                          </>
                        }
                        placeholder="Cidade"
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="telefone1"
                        label={
                          <>
                            <span className="text-destructive">*</span> Telefone
                            de contato/emergência 1
                          </>
                        }
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                      />
                      <FormField
                        control={form.control}
                        name="telefone2"
                        label="Telefone de contato/emergência 2"
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        label={
                          <>
                            <span className="text-destructive">*</span> E-mail
                          </>
                        }
                        type="email"
                        placeholder="Informe o e-mail"
                      />
                      <FormField
                        control={form.control}
                        name="dreCodigoEol"
                        label={
                          <>
                            <span className="text-destructive">*</span> DRE
                          </>
                        }
                        type="select"
                        options={dres.map((dre) => ({
                          value: dre.codigo_dre,
                          label: dre.nome_dre,
                        }))}
                        placeholder="Selecione a DRE"
                      />
                      <FormField
                        control={form.control}
                        name="polo"
                        label={
                          <>
                            <span className="text-destructive">*</span> Polo de
                            Inscrição
                          </>
                        }
                        type="select"
                        disabled={!dreCodigoEol}
                        options={polos.map((polo) => ({
                          value: polo.uuid,
                          label: polo.nome_polo,
                        }))}
                        placeholder="Selecione o Polo"
                      />
                    </div>
                  ) : null}
                  {secao.id === 'informacoes-por-grupo' ? (
                    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
                      <FormFieldLeitura
                        id="idade"
                        label={
                          <>
                            <span className="text-destructive">*</span> Idade
                          </>
                        }
                        value={idade}
                      />
                      <FormField
                        control={form.control}
                        name="grupoParticipante"
                        label={
                          <>
                            <span className="text-destructive">*</span> Grupo do
                            Participante
                          </>
                        }
                        type="select"
                        options={OPCOES_GRUPO_PARTICIPANTE}
                        placeholder="Selecione o grupo"
                      />
                      <FormField
                        control={form.control}
                        name="estaNaRede"
                        label={
                          <>
                            <span className="text-destructive">*</span> É aluno
                            da Rede Municipal?
                          </>
                        }
                        type="radio"
                        options={OPCOES_SIM_NAO}
                      />
                      <FormField
                        control={form.control}
                        name="tipoEscola"
                        label={
                          <>
                            <span className="text-destructive">*</span> Tipo de
                            escola
                          </>
                        }
                        type="radio"
                        options={OPCOES_TIPO_ESCOLA}
                      />
                      <FormField
                        control={form.control}
                        name="unidadeEducacional"
                        label={
                          <>
                            <span className="text-destructive">*</span> Unidade
                            Educacional do participante
                          </>
                        }
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="turmaAno"
                        label={
                          <>
                            <span className="text-destructive">*</span> Turma /
                            Ano
                          </>
                        }
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="podeIrSozinho"
                        label={
                          <>
                            <span className="text-destructive">*</span> Pode ir
                            embora sozinho?
                          </>
                        }
                        type="radio"
                        options={OPCOES_SIM_NAO}
                      />
                      <FormField
                        control={form.control}
                        name="responsavelRetirada"
                        label={
                          <>
                            <span className="text-destructive">*</span>{' '}
                            Responsável por retirar na saída
                          </>
                        }
                      />
                      <FormField
                        control={form.control}
                        name="autorizaPiscina"
                        label={
                          <>
                            <span className="text-destructive">*</span> Autoriza
                            uso da piscina?
                          </>
                        }
                        type="radio"
                        options={OPCOES_SIM_NAO}
                      />
                    </div>
                  ) : null}
                  {secao.id === 'informacoes-de-saude' ? (
                    <div className="flex flex-col gap-5.5">
                      {PERGUNTAS_SAUDE.map((pergunta) => (
                        <PerguntaSaude
                          key={pergunta.name}
                          control={form.control}
                          setValue={form.setValue}
                          pergunta={pergunta}
                        />
                      ))}
                      <AnexoDocumentos />
                    </div>
                  ) : null}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button
            type="button"
            variant="outline"
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
            onClick={() => navigate('/inicio')}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
            onClick={salvarRascunho}
          >
            Salvar Rascunho
          </Button>
          <Button
            type="button"
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
            onClick={salvar}
          >
            Salvar
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
