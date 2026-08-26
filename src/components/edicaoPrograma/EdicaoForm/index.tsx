import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useGetEdicaoPrograma } from '@/hooks/useGetEdicaoPrograma'
import { usePostEdicaoPrograma } from '@/hooks/usePostEdicaoPrograma'
import { usePutEdicaoPrograma } from '@/hooks/usePutEdicaoPrograma'

type EdicaoFormProps = {
  edicaoId?: string
}

export function EdicaoForm({ edicaoId }: Readonly<EdicaoFormProps>) {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      dataInicioEdicao: '',
      dataFimEdicao: '',
      dataInicioInscricoes: '',
      dataFimInscricoes: '',
    },
  })

  const edicaoQuery = useGetEdicaoPrograma(edicaoId)
  const cadastroMutation = usePostEdicaoPrograma()
  const atualizacaoMutation = usePutEdicaoPrograma(edicaoId)

  useEffect(() => {
    if (!edicaoQuery.data) return

    form.reset({
      nome: edicaoQuery.data.nome,
      dataInicioEdicao: edicaoQuery.data.data_inicio,
      dataFimEdicao: edicaoQuery.data.data_fim,
      dataInicioInscricoes: edicaoQuery.data.inscricoes_inicio,
      dataFimInscricoes: edicaoQuery.data.inscricoes_fim,
    })
  }, [edicaoQuery.data, form])

  const salvando = cadastroMutation.isPending || atualizacaoMutation.isPending

  const valoresFormulario = useWatch({ control: form.control })

  useEffect(() => {
    if (cadastroMutation.isError) {
      cadastroMutation.reset()
    }
    if (atualizacaoMutation.isError) {
      atualizacaoMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda a cada alteração de qualquer campo, para limpar o erro de mutation anterior
  }, [valoresFormulario])

  function onSubmit(data: FormValues) {
    if (edicaoId) {
      atualizacaoMutation.mutate(data, {
        onSuccess: () => {
          navigate('/edicoes-programa', { state: { edicaoAtualizada: true } })
        },
      })
      return
    }

    cadastroMutation.mutate(data, {
      onSuccess: () => {
        navigate('/edicoes-programa', { state: { edicaoCadastrada: true } })
      },
    })
  }

  if (edicaoId && edicaoQuery.isPending) {
    return <IndicadorCarregamento mensagem="Carregando edição do programa..." />
  }

  if (edicaoId && !edicaoQuery.data) {
    return <AlertaErroApi erro={edicaoQuery.error} />
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
    >
      <FieldGroup>
        <AlertaErroApi
          erro={cadastroMutation.error ?? atualizacaoMutation.error}
        />

        <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
          <Controller
            name="nome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nome" className="font-bold">
                  Nome da Edição do Programa
                </FieldLabel>
                <Input
                  {...field}
                  id="nome"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-sm border-input-border-muted"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field
            data-invalid={Boolean(
              form.formState.errors.dataInicioEdicao ||
              form.formState.errors.dataFimEdicao,
            )}
          >
            <FieldLabel htmlFor="dataInicioEdicao" className="font-bold">
              Período da Edição do Programa
            </FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="dataInicioEdicao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <DatePicker
                      id="dataInicioEdicao"
                      value={field.value}
                      placeholder="De"
                      aria-label="Data de início da edição"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted px-2 hover:bg-background [&_svg]:size-5 [&_svg]:text-brand-dark"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name="dataFimEdicao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <DatePicker
                      id="dataFimEdicao"
                      value={field.value}
                      placeholder="Até"
                      aria-label="Data de fim da edição"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted px-2 hover:bg-background [&_svg]:size-5 [&_svg]:text-brand-dark"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
            </div>
          </Field>

          <Field
            data-invalid={Boolean(
              form.formState.errors.dataInicioInscricoes ||
              form.formState.errors.dataFimInscricoes,
            )}
          >
            <FieldLabel htmlFor="dataInicioInscricoes" className="font-bold">
              Período das Inscrições
            </FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="dataInicioInscricoes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <DatePicker
                      id="dataInicioInscricoes"
                      value={field.value}
                      placeholder="De"
                      aria-label="Data de início das inscrições"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted px-2 hover:bg-background [&_svg]:size-5 [&_svg]:text-brand-dark"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name="dataFimInscricoes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <DatePicker
                      id="dataFimInscricoes"
                      value={field.value}
                      placeholder="Até"
                      aria-label="Data de fim das inscrições"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted px-2 hover:bg-background [&_svg]:size-5 [&_svg]:text-brand-dark"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="QuantidadeInscritos" className="font-bold">
              Quantidade de Inscritos
            </FieldLabel>
            <Input
              id="QuantidadeInscritos"
              type="number"
              readOnly
              value={edicaoQuery.data?.quantidade_inscritos ?? 0}
              className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="QuantidadeAtendimentoEfetivo"
              className="font-bold"
            >
              Quantidade de Atendimento Efetivo
            </FieldLabel>
            <Input
              id="QuantidadeAtendimentoEfetivo"
              type="number"
              readOnly
              value={edicaoQuery.data?.quantidade_atendimento_efetivo ?? 0}
              className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="QuantidadePasseios" className="font-bold">
              Quantidade de Passeios
            </FieldLabel>
            <Input
              id="QuantidadePasseios"
              type="number"
              readOnly
              value={edicaoQuery.data?.quantidade_passeios ?? 0}
              className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
            />
          </Field>
        </div>

        <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="QuantidadeApresentacoes" className="font-bold">
              Quantidade de Apresentações
            </FieldLabel>
            <Input
              id="QuantidadeApresentacoes"
              type="number"
              readOnly
              value={edicaoQuery.data?.quantidade_apresentacoes ?? 0}
              className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button
            type="button"
            variant="outline"
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
            onClick={() => navigate('/edicoes-programa')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
