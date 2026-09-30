import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
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
import { useGetPolosElegiveis } from '@/hooks/useGetPolosElegiveis'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { usePostInscricao } from '@/hooks/usePostInscricao'
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
                cadastroMutation.error ??
                dresQuery.error ??
                polosQuery.error ??
                choicesQuery.error
              }
              onBuscarCodigoEol={onBuscarCodigoEol}
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
