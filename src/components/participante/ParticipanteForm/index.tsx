import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  AGRUPAMENTO_BERCARIO,
  AGRUPAMENTO_MINI_GRUPO,
  ESTA_NA_REDE_SIM,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
import { InformacoesBasicas } from './InformacoesBasicas'
import { InformacoesPorGrupo } from './InformacoesPorGrupo'
import { InformacoesSaude } from './InformacoesSaude'
import { SecaoFormulario } from './SecaoFormulario'
import type { FormValues } from './schema'
import formSchema from './schema'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetPolosElegiveis } from '@/hooks/useGetPolosElegiveis'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { usePostInscricao } from '@/hooks/usePostInscricao'
import { calcularIdade } from '@/utils/calcularIdade'
import { useToast } from '@/hooks/useToast'

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
  const cadastroMutation = usePostInscricao()
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
  const polosQuery = useGetPolosElegiveis(dreCodigoEol)
  const choicesQuery = useGetValoresChoices()
  const dres = dresQuery.data ?? []
  const polos = polosQuery.data ?? []
  const tiposEstudante = choicesQuery.data?.tipo_estudante ?? []
  const grupos = choicesQuery.data?.grupo_inscricao ?? []
  const tipoTravado =
    agrupamento === AGRUPAMENTO_BERCARIO ||
    agrupamento === AGRUPAMENTO_MINI_GRUPO
  const secoesLiberadas = Boolean(agrupamento) && Boolean(tipoEstudante)

  function aoMudarAgrupamento(valor: string) {
    const tipo =
      valor === AGRUPAMENTO_BERCARIO || valor === AGRUPAMENTO_MINI_GRUPO
        ? TIPO_ESTUDANTE_REDE
        : ''

    form.setValue('tipoEstudante', tipo)
    form.setValue(
      'estaNaRede',
      tipo === TIPO_ESTUDANTE_REDE ? ESTA_NA_REDE_SIM : '',
    )
    form.setValue('grupoParticipante', '')
    form.setValue('tipoEscola', '')
    form.setValue('podeIrSozinho', '')
    form.setValue('responsavelRetirada', '')
    form.setValue('autorizaPiscina', '')
  }

  function aoMudarTipoEstudante(valor: string) {
    form.setValue(
      'estaNaRede',
      valor === TIPO_ESTUDANTE_REDE ? ESTA_NA_REDE_SIM : '',
    )
  }

  function aoMudarDre() {
    form.setValue('polo', '')
  }

  function salvar(dados: FormValues) {
    if (cadastroMutation.isError) {
      cadastroMutation.reset()
    }

    const dreNome =
      dres.find((dre) => dre.codigo_dre === dados.dreCodigoEol)?.nome_dre ?? ''

    cadastroMutation.mutate(
      {
        ...dados,
        dreNome,
      },
      {
        onSuccess: (inscricao) => {
          showToast({
            id: 'inscricao-salva',
            description: inscricao.status_label,
          })
        },
      },
    )
  }

  return (
    <form
      noValidate
      aria-label="Formulário de cadastro de participante"
      onSubmit={form.handleSubmit(salvar)}
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
          <SecaoFormulario titulo="Informações Básicas" aberta>
            <InformacoesBasicas
              control={form.control}
              agrupamento={agrupamento}
              tipoTravado={tipoTravado}
              tipoEstudante={tipoEstudante}
              dreCodigoEol={dreCodigoEol}
              dres={dres}
              polos={polos}
              tiposEstudante={tiposEstudante}
              erro={
                cadastroMutation.error ??
                dresQuery.error ??
                polosQuery.error ??
                choicesQuery.error
              }
              onBuscarCodigoEol={onBuscarCodigoEol}
              onBuscarCpf={onBuscarCpf}
              aoMudarAgrupamento={aoMudarAgrupamento}
              aoMudarTipoEstudante={aoMudarTipoEstudante}
              aoMudarDre={aoMudarDre}
            />
          </SecaoFormulario>
          {secoesLiberadas ? (
            <SecaoFormulario titulo="Informações por Grupo">
              <InformacoesPorGrupo
                control={form.control}
                idade={idade}
                grupos={grupos}
              />
            </SecaoFormulario>
          ) : null}
          {secoesLiberadas ? (
            <SecaoFormulario titulo="Informações de Saúde">
              <InformacoesSaude
                control={form.control}
                setValue={form.setValue}
              />
            </SecaoFormulario>
          ) : null}
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
            type="submit"
            variant="outline"
            disabled={cadastroMutation.isPending}
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
          >
            Salvar Rascunho
          </Button>
          <Button
            type="submit"
            disabled={cadastroMutation.isPending}
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
          >
            Salvar
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
