import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  useController,
  useForm,
  type Control,
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { usePostEdicaoPrograma } from '@/hooks/usePostEdicaoPrograma'
import { ErroCadastroEdicaoPrograma } from '@/services/edicaoPrograma/cadastrarEdicaoPrograma'

function GrupoPeriodo({
  rotulo,
  nomeInicio,
  nomeFim,
  rotuloInicio,
  rotuloFim,
  control,
  onCampoAlterado,
}: Readonly<{
  rotulo: string
  nomeInicio: keyof FormValues
  nomeFim: keyof FormValues
  rotuloInicio: string
  rotuloFim: string
  control: Control<FormValues>
  onCampoAlterado: () => void
}>) {
  const inicio = useController({ name: nomeInicio, control })
  const fim = useController({ name: nomeFim, control })

  return (
    <Field data-invalid={inicio.fieldState.invalid || fim.fieldState.invalid}>
      <FieldLabel htmlFor={nomeInicio} className="font-bold">
        {rotulo}
      </FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <DatePicker
            id={nomeInicio}
            value={inicio.field.value}
            placeholder="De"
            aria-label={rotuloInicio}
            aria-invalid={inicio.fieldState.invalid}
            className="h-10 rounded-sm border-(--color-input-border-muted) px-2 shadow-none hover:bg-background hover:text-foreground [&_svg]:size-5 [&_svg]:text-brand-dark"
            onChange={(iso) => {
              onCampoAlterado()
              inicio.field.onChange(iso)
            }}
            onBlur={inicio.field.onBlur}
          />
          {inicio.fieldState.invalid && (
            <FieldError
              className="text-xs"
              errors={[inicio.fieldState.error]}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <DatePicker
            id={nomeFim}
            value={fim.field.value}
            placeholder="Até"
            aria-label={rotuloFim}
            aria-invalid={fim.fieldState.invalid}
            className="h-10 rounded-sm border-(--color-input-border-muted) px-2 shadow-none hover:bg-background hover:text-foreground [&_svg]:size-5 [&_svg]:text-brand-dark"
            onChange={(iso) => {
              onCampoAlterado()
              fim.field.onChange(iso)
            }}
            onBlur={fim.field.onBlur}
          />
          {fim.fieldState.invalid && (
            <FieldError className="text-xs" errors={[fim.fieldState.error]} />
          )}
        </div>
      </div>
    </Field>
  )
}

export function EdicaoForm() {
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

  const cadastroMutation = usePostEdicaoPrograma()

  function limparErroDaMutation() {
    if (cadastroMutation.isError) {
      cadastroMutation.reset()
    }
  }

  function onSubmit(data: FormValues) {
    cadastroMutation.mutate(data, {
      onSuccess: () => {
        navigate('/edicoes-programa')
      },
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-sm bg-background p-8 shadow-(--shadow-card) max-md:p-4"
    >
      <FieldGroup className="gap-5.5">
        {cadastroMutation.error instanceof ErroCadastroEdicaoPrograma &&
          cadastroMutation.error.mensagemUsuario && (
            <Alert
              variant="destructive"
              className="border-[#e8b4b8] bg-[#f8d7da] text-center font-bold text-[#721c24]"
            >
              <AlertDescription className="text-[#721c24]">
                {cadastroMutation.error.mensagemUsuario}
              </AlertDescription>
            </Alert>
          )}

        <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
          <Controller
            name="nome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="NomeDaEdicao" className="font-bold">
                  Nome da Edição do Programa
                </FieldLabel>
                <div className="flex flex-col gap-1">
                  <Input
                    {...field}
                    id="NomeDaEdicao"
                    placeholder="Digite o Nome da Edição do Programa"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-sm border-(--color-input-border-muted) text-sm"
                    onChange={(event) => {
                      limparErroDaMutation()
                      field.onChange(event)
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className="text-xs"
                      errors={[fieldState.error]}
                    />
                  )}
                </div>
              </Field>
            )}
          />

          <GrupoPeriodo
            rotulo="Período da Edição do Programa"
            nomeInicio="dataInicioEdicao"
            nomeFim="dataFimEdicao"
            rotuloInicio="Data de início da edição"
            rotuloFim="Data de fim da edição"
            control={form.control}
            onCampoAlterado={limparErroDaMutation}
          />

          <GrupoPeriodo
            rotulo="Período das Inscrições"
            nomeInicio="dataInicioInscricoes"
            nomeFim="dataFimInscricoes"
            rotuloInicio="Data de início das inscrições"
            rotuloFim="Data de fim das inscrições"
            control={form.control}
            onCampoAlterado={limparErroDaMutation}
          />
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
              placeholder="Quantidade de Inscritos"
              value={0}
              className="h-10 cursor-not-allowed rounded-sm border-(--color-input-border-muted) bg-(--color-input-disabled-bg) text-sm text-placeholder"
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
              placeholder="Quantidade de Atendimento Efetivo"
              value={0}
              className="h-10 cursor-not-allowed rounded-sm border-(--color-input-border-muted) bg-(--color-input-disabled-bg) text-sm text-placeholder"
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
              placeholder="Quantidade de Passeios"
              value={0}
              className="h-10 cursor-not-allowed rounded-sm border-(--color-input-border-muted) bg-(--color-input-disabled-bg) text-sm text-placeholder"
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
              placeholder="Quantidade de Apresentações"
              value={0}
              className="h-10 cursor-not-allowed rounded-sm border-(--color-input-border-muted) bg-(--color-input-disabled-bg) text-sm text-placeholder"
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
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-(--color-button-primary-disabled-bg) disabled:opacity-100"
            disabled={cadastroMutation.isPending}
          >
            {cadastroMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
