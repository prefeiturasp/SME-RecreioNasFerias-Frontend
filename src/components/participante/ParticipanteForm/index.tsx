import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { grupoExigeEstudanteDaRede, TIPO_ESTUDANTE_REDE } from './constantes'
import { InformacoesBasicas } from './InformacoesBasicas'
import { SecaoFormulario } from './SecaoFormulario'
import type { FormValues } from './schema'
import formSchema from './schema'

import { BlocoTexto } from '@/components/BlocoTexto'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetParticipanteEol } from '@/hooks/useGetParticipanteEol'
import { useGetPolosElegiveis } from '@/hooks/useGetPolosElegiveis'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { usePostInscricao } from '@/hooks/usePostInscricao'
import { useToast } from '@/hooks/useToast'

const CAMPOS_DO_PARTICIPANTE_VAZIOS = {
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
}

type ParticipanteFormProps = {
  onBuscarCpf?: (cpf: string) => void
}

export function ParticipanteForm({ onBuscarCpf }: ParticipanteFormProps = {}) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const cadastroMutation = usePostInscricao()
  const consultaParticipante = useGetParticipanteEol()
  const [codigoEolSincronizado, setCodigoEolSincronizado] = useState<
    string | null
  >(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grupo: '',
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
    },
  })
  const [grupo, tipoEstudante, dreCodigoEol] = useWatch({
    control: form.control,
    name: ['grupo', 'tipoEstudante', 'dreCodigoEol'],
  })
  const dresQuery = useGetDres()
  const polosQuery = useGetPolosElegiveis(dreCodigoEol)
  const choicesQuery = useGetValoresChoices()
  const dres = useMemo(() => dresQuery.data ?? [], [dresQuery.data])
  const polos = useMemo(() => polosQuery.data ?? [], [polosQuery.data])
  const tiposEstudante = useMemo(
    () => choicesQuery.data?.tipo_estudante ?? [],
    [choicesQuery.data?.tipo_estudante],
  )
  const grupos = useMemo(
    () => choicesQuery.data?.grupo_inscricao ?? [],
    [choicesQuery.data?.grupo_inscricao],
  )
  const tipoTravado = useMemo(() => grupoExigeEstudanteDaRede(grupo), [grupo])
  const camposLiberados = useMemo(
    () => Boolean(grupo) && Boolean(tipoEstudante),
    [grupo, tipoEstudante],
  )

  function aoMudarGrupo(valor: string) {
    form.setValue(
      'tipoEstudante',
      grupoExigeEstudanteDaRede(valor) ? TIPO_ESTUDANTE_REDE : '',
    )
  }

  function aoMudarDre() {
    form.setValue('polo', '')
  }

  function limparCamposDoParticipante(codigoEol = form.getValues('codigoEol')) {
    form.reset({
      ...form.getValues(),
      ...CAMPOS_DO_PARTICIPANTE_VAZIOS,
      codigoEol,
    })
    setCodigoEolSincronizado(null)
  }

  function consultarParticipante(codigoEol: string) {
    consultaParticipante.mutate(codigoEol, {
      onSuccess: (participante) => {
        form.reset({
          ...form.getValues(),
          codigoEol: participante.codigo_eol,
          nomeCompleto: participante.nome_participante,
          dataNascimento: participante.data_nascimento,
          nomeResponsavel: participante.responsavel_nome,
          nomeSocialResponsavel: participante.responsavel_nome_social,
          cep: participante.cep,
          logradouro: participante.logradouro,
          numero: participante.numero,
          complemento: participante.complemento,
          bairro: participante.bairro,
          cidade: participante.cidade,
          telefone1: participante.telefone_contato_1,
          telefone2: participante.telefone_contato_2,
          email: participante.email,
        })
        setCodigoEolSincronizado(participante.codigo_eol)
      },
      onError: () => {
        limparCamposDoParticipante()
      },
    })
  }

  function aoMudarCodigoEol(valor: string) {
    const codigoAlteradoAposConsulta =
      codigoEolSincronizado !== null && valor !== codigoEolSincronizado

    if (codigoAlteradoAposConsulta) {
      limparCamposDoParticipante(valor)
      consultaParticipante.reset()
      return
    }

    if (consultaParticipante.isError) {
      consultaParticipante.reset()
    }
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
        <BlocoTexto>
          Usuário deve visualizar texto com orientações que precisa compartilhar
          com familiares e responsáveis.
        </BlocoTexto>

        <div className="flex flex-col gap-4">
          <SecaoFormulario titulo="Informações Básicas" aberta>
            <InformacoesBasicas
              control={form.control}
              grupo={grupo}
              tipoTravado={tipoTravado}
              camposLiberados={camposLiberados}
              tipoEstudante={tipoEstudante}
              dreCodigoEol={dreCodigoEol}
              dres={dres}
              polos={polos}
              tiposEstudante={tiposEstudante}
              grupos={grupos}
              erro={
                consultaParticipante.error ??
                cadastroMutation.error ??
                dresQuery.error ??
                polosQuery.error ??
                choicesQuery.error
              }
              consultandoCodigoEol={consultaParticipante.isPending}
              onBuscarCodigoEol={consultarParticipante}
              aoMudarCodigoEol={aoMudarCodigoEol}
              onBuscarCpf={onBuscarCpf}
              aoMudarGrupo={aoMudarGrupo}
              aoMudarDre={aoMudarDre}
            />
          </SecaoFormulario>
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
