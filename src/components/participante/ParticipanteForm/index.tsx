import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  AGRUPAMENTO_BERCARIO,
  AGRUPAMENTO_MINI_GRUPO,
  OPCOES_AGRUPAMENTO,
  OPCOES_TIPO_ESTUDANTE,
  TIPO_ESTUDANTE_REDE,
} from './constantes'
import type { FormValues } from './schema'
import formSchema from './schema'

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

export function ParticipanteForm() {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agrupamento: '',
      tipoEstudante: '',
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
  const tipoTravado =
    agrupamento === AGRUPAMENTO_BERCARIO ||
    agrupamento === AGRUPAMENTO_MINI_GRUPO
  const secoesLiberadas = Boolean(agrupamento) && Boolean(tipoEstudante)

  useEffect(() => {
    if (!agrupamento) return

    form.setValue('tipoEstudante', tipoTravado ? TIPO_ESTUDANTE_REDE : '')
  }, [agrupamento, form, tipoTravado])

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
                        <FormField
                          control={form.control}
                          name="tipoEstudante"
                          label={
                            <>
                              <span className="text-destructive">*</span> Tipo
                              de estudante
                            </>
                          }
                          readOnly
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
          >
            Salvar Rascunho
          </Button>
          <Button
            type="button"
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
          >
            Salvar
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
