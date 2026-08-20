import { useState } from 'react'
import { format, isValid, parse } from 'date-fns'
import { ptBR as dateFnsPtBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ptBR } from 'react-day-picker/locale'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePostEdicaoPrograma } from '@/hooks/usePostEdicaoPrograma'
import { cn } from '@/lib/utils'
import type { EstadoNavegacaoEdicoesPrograma } from '@/pages/PaginaEdicoesPrograma/types'
import { QUANTIDADES_MOCK_CADASTRO_EDICAO } from '@/services/edicaoPrograma/mocks'
import { formularioCadastroEstaPreenchido } from '@/services/edicaoPrograma/validarCadastroEdicao'
import { obterMensagemDeErroCadastroEdicao } from './mensagensErro'
import type { FormValues } from './schema'
import formSchema from './schema'

function isoParaDate(iso: string): Date | undefined {
  if (!iso.trim()) {
    return undefined
  }

  const data = parse(iso, 'yyyy-MM-dd', new Date())
  return isValid(data) ? data : undefined
}

function CampoData({
  id,
  value,
  placeholder,
  rotuloAcessivel,
  invalido = false,
  onChange,
  onBlur,
}: Readonly<{
  id: string
  value: string
  placeholder: 'De' | 'Até'
  rotuloAcessivel: string
  invalido?: boolean
  onChange: (iso: string) => void
  onBlur?: () => void
}>) {
  const [aberto, setAberto] = useState(false)
  const selecionada = isoParaDate(value)
  const [mesVisivel, setMesVisivel] = useState<Date>(selecionada ?? new Date())

  return (
    <Popover
      open={aberto}
      onOpenChange={(abertoAgora) => {
        setAberto(abertoAgora)
        if (abertoAgora) {
          setMesVisivel(selecionada ?? new Date())
        } else {
          onBlur?.()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={rotuloAcessivel}
          aria-invalid={invalido}
          className={cn(
            'h-[var(--size-input-height)] w-full justify-between rounded-[var(--size-radius-sm)] border-[var(--color-input-border-muted)] bg-background px-2 text-sm font-normal text-foreground shadow-none hover:bg-background hover:text-foreground [&_svg]:size-5',
            !value && 'text-placeholder',
          )}
        >
          <span className="truncate">
            {selecionada
              ? format(selecionada, 'dd/MM/yyyy', { locale: dateFnsPtBR })
              : placeholder}
          </span>
          <CalendarIcon className="size-5 text-brand-dark" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selecionada}
          month={mesVisivel}
          onMonthChange={setMesVisivel}
          onSelect={(data) => {
            onChange(data ? format(data, 'yyyy-MM-dd') : '')
            setAberto(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

const CAMPOS_NUMERICOS_DESABILITADOS = [
  {
    id: 'QuantidadeInscritos',
    rotulo: 'Quantidade de Inscritos',
    placeholder: 'Quantidade de Inscritos',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeInscritos,
  },
  {
    id: 'QuantidadeAtendimentoEfetivo',
    rotulo: 'Quantidade de Atendimento Efetivo',
    placeholder: 'Quantidade de Atendimento Efetivo',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeAtendimentoEfetivo,
  },
  {
    id: 'QuantidadePasseios',
    rotulo: 'Quantidade de Passeios',
    placeholder: 'Quantidade de Passeios',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadePasseios,
  },
  {
    id: 'QuantidadeApresentacoes',
    rotulo: 'Quantidade de Apresentações',
    placeholder: 'Quantidade de Apresentações',
    valor: QUANTIDADES_MOCK_CADASTRO_EDICAO.quantidadeApresentacoes,
  },
] as const

const classeRotulo = 'text-sm font-bold text-foreground'
const classeInput =
  'h-[var(--size-input-height)] rounded-[var(--size-radius-sm)] border-[var(--color-input-border-muted)] text-sm md:text-sm'
const classeInputSomenteLeitura =
  'cursor-not-allowed bg-[var(--color-input-disabled-bg)] text-placeholder'

function GrupoPeriodo({
  rotulo,
  nomeInicio,
  nomeFim,
  idInicio,
  idFim,
  rotuloAcessivelInicio,
  rotuloAcessivelFim,
  control,
  onCampoAlterado,
}: {
  rotulo: string
  nomeInicio: keyof FormValues
  nomeFim: keyof FormValues
  idInicio: string
  idFim: string
  rotuloAcessivelInicio: string
  rotuloAcessivelFim: string
  control: ReturnType<typeof useForm<FormValues>>['control']
  onCampoAlterado: () => void
}) {
  return (
    <Controller
      name={nomeInicio}
      control={control}
      render={({ field: inicio, fieldState: estadoInicio }) => (
        <Controller
          name={nomeFim}
          control={control}
          render={({ field: fim, fieldState: estadoFim }) => (
            <Field data-invalid={estadoInicio.invalid || estadoFim.invalid}>
              <FieldLabel htmlFor={idInicio} className={classeRotulo}>
                {rotulo}
              </FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                <CampoData
                  id={idInicio}
                  value={inicio.value}
                  placeholder="De"
                  rotuloAcessivel={rotuloAcessivelInicio}
                  invalido={estadoInicio.invalid}
                  onChange={(iso) => {
                    onCampoAlterado()
                    inicio.onChange(iso)
                  }}
                  onBlur={inicio.onBlur}
                />
                <CampoData
                  id={idFim}
                  value={fim.value}
                  placeholder="Até"
                  rotuloAcessivel={rotuloAcessivelFim}
                  invalido={estadoFim.invalid}
                  onChange={(iso) => {
                    onCampoAlterado()
                    fim.onChange(iso)
                  }}
                  onBlur={fim.onBlur}
                />
              </div>
              {(estadoInicio.invalid || estadoFim.invalid) && (
                <FieldError errors={[estadoInicio.error, estadoFim.error]} />
              )}
            </Field>
          )}
        />
      )}
    />
  )
}

export function CadastroEdicaoForm() {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      nome: '',
      dataInicioEdicao: '',
      dataFimEdicao: '',
      dataInicioInscricoes: '',
      dataFimInscricoes: '',
    },
  })

  const cadastroMutation = usePostEdicaoPrograma()
  const valores = useWatch({ control: form.control })
  const { isValid, isSubmitted } = form.formState
  const formularioPreenchido = formularioCadastroEstaPreenchido({
    nome: valores.nome ?? '',
    dataInicioEdicao: valores.dataInicioEdicao ?? '',
    dataFimEdicao: valores.dataFimEdicao ?? '',
    dataInicioInscricoes: valores.dataInicioInscricoes ?? '',
    dataFimInscricoes: valores.dataFimInscricoes ?? '',
  })
  const salvarDesabilitado =
    cadastroMutation.isPending ||
    !formularioPreenchido ||
    (isSubmitted && !isValid)

  function voltarParaEdicoes() {
    navigate('/edicoes-programa')
  }

  function limparErroDaMutation() {
    if (cadastroMutation.isError) {
      cadastroMutation.reset()
    }
  }

  function onSubmit(data: FormValues) {
    cadastroMutation.mutate(data, {
      onSuccess: () => {
        navigate('/edicoes-programa', {
          state: {
            edicaoCadastrada: true,
          } satisfies EstadoNavegacaoEdicoesPrograma,
        })
      },
    })
  }

  const mensagemDeErro = cadastroMutation.isError
    ? obterMensagemDeErroCadastroEdicao(cadastroMutation.error)
    : null

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-[var(--size-radius-sm)] bg-background p-[var(--size-content-padding)] shadow-[var(--shadow-card)] max-md:p-[var(--size-content-padding-mobile)]"
    >
      <FieldGroup className="gap-[var(--size-form-row-gap)]">
        {mensagemDeErro && (
          <Alert
            variant="destructive"
            className="border-[#e8b4b8] bg-[#f8d7da] text-center font-bold text-[#721c24]"
          >
            <AlertDescription className="text-sm text-[#721c24]">
              {mensagemDeErro}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-x-4 gap-y-[var(--size-form-row-gap)] lg:grid-cols-3">
          <Controller
            name="nome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="NomeDaEdicao" className={classeRotulo}>
                  Nome da Edição do Programa
                </FieldLabel>
                <Input
                  {...field}
                  id="NomeDaEdicao"
                  placeholder="Digite o Nome da Edição do Programa"
                  aria-invalid={fieldState.invalid}
                  className={classeInput}
                  onChange={(event) => {
                    limparErroDaMutation()
                    field.onChange(event)
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <GrupoPeriodo
            rotulo="Período da Edição do Programa"
            nomeInicio="dataInicioEdicao"
            nomeFim="dataFimEdicao"
            idInicio="DataInicioEdicao"
            idFim="DataFimEdicao"
            rotuloAcessivelInicio="Data de início da edição"
            rotuloAcessivelFim="Data de fim da edição"
            control={form.control}
            onCampoAlterado={limparErroDaMutation}
          />

          <GrupoPeriodo
            rotulo="Período das Inscrições"
            nomeInicio="dataInicioInscricoes"
            nomeFim="dataFimInscricoes"
            idInicio="DataInicioInscricoes"
            idFim="DataFimInscricoes"
            rotuloAcessivelInicio="Data de início das inscrições"
            rotuloAcessivelFim="Data de fim das inscrições"
            control={form.control}
            onCampoAlterado={limparErroDaMutation}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-[var(--size-form-row-gap)] lg:grid-cols-3">
          {CAMPOS_NUMERICOS_DESABILITADOS.slice(0, 3).map((campo) => (
            <Field key={campo.id}>
              <FieldLabel htmlFor={campo.id} className={classeRotulo}>
                {campo.rotulo}
              </FieldLabel>
              <Input
                id={campo.id}
                name={campo.id}
                type="number"
                readOnly
                placeholder={campo.placeholder}
                value={campo.valor}
                className={`${classeInput} ${classeInputSomenteLeitura}`}
              />
            </Field>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-[var(--size-form-row-gap)] lg:grid-cols-3">
          <Field>
            <FieldLabel
              htmlFor={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
              className={classeRotulo}
            >
              {CAMPOS_NUMERICOS_DESABILITADOS[3].rotulo}
            </FieldLabel>
            <Input
              id={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
              name={CAMPOS_NUMERICOS_DESABILITADOS[3].id}
              type="number"
              readOnly
              placeholder={CAMPOS_NUMERICOS_DESABILITADOS[3].placeholder}
              value={CAMPOS_NUMERICOS_DESABILITADOS[3].valor}
              className={`${classeInput} ${classeInputSomenteLeitura}`}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button
            type="button"
            variant="outline"
            className="h-[var(--size-button-height)] rounded-[var(--size-radius-sm)] border-brand-dark px-4 text-sm font-bold text-brand-dark hover:bg-[#f8f9fb] hover:text-brand-dark"
            onClick={voltarParaEdicoes}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="h-[var(--size-button-height)] rounded-[var(--size-radius-sm)] bg-brand-dark px-4 text-sm font-bold text-background hover:bg-brand-dark-hover disabled:bg-[#7b7b97] disabled:opacity-100"
            disabled={salvarDesabilitado}
          >
            {cadastroMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
