import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { useEffect, type SubmitEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { useGetDefinicaoPolo } from '@/hooks/useGetDefinicaoPolo'
import { usePutDefinicaoPolo } from '@/hooks/usePutDefinicaoPolo'
import { useToast } from '@/hooks/useToast'
import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '@/utils/mascarasEntrada'

const ROTA_DEFINICOES_POLO = '/definicoes-polo'
const TOAST_ERRO_CARREGAMENTO_ID = 'erro-carregamento-definicao-polo'
const TOAST_ERRO_ATUALIZACAO_ID = 'erro-atualizacao-definicao-polo'
const TOAST_SUCESSO_ATUALIZACAO_ID = 'sucesso-atualizacao-definicao-polo'
const CLASSE_CAMPO_LEITURA =
  'h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder'

type ErroApi = AxiosError<{ detalhe: string }>

type DefinicaoPoloFormProps = {
  definicaoUuid: string
}

function rotuloGestao(gestao: string) {
  if (gestao === 'direta') return 'Direta'
  if (gestao === 'parceira') return 'Parceira'
  return gestao
}

function CampoLeitura({
  id,
  label,
  value,
}: Readonly<{
  id: string
  label: string
  value: string
}>) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="font-bold">
        {label}
      </FieldLabel>
      <Input
        id={id}
        value={value}
        readOnly
        aria-readonly="true"
        className={CLASSE_CAMPO_LEITURA}
      />
    </Field>
  )
}

export function DefinicaoPoloForm({
  definicaoUuid,
}: Readonly<DefinicaoPoloFormProps>) {
  const navigate = useNavigate()
  const { dismissToast, showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projecaoInscritos: '',
      pontoFocalNome: '',
      pontoFocalTelefone: '',
      pontoFocalEmail: '',
    },
  })

  const definicaoQuery = useGetDefinicaoPolo(definicaoUuid)
  const atualizacaoMutation = usePutDefinicaoPolo(definicaoUuid)

  useEffect(() => {
    if (!definicaoQuery.data) return

    const definicao = definicaoQuery.data

    form.reset({
      projecaoInscritos: String(definicao.projecao_inscritos),
      pontoFocalNome: definicao.ponto_focal_nome,
      pontoFocalTelefone: definicao.ponto_focal_telefone
        ? aplicarMascaraTelefone(definicao.ponto_focal_telefone)
        : '',
      pontoFocalEmail: definicao.ponto_focal_email,
    })
  }, [definicaoQuery.data, form])

  useEffect(() => {
    if (!definicaoQuery.isError) return

    showToast({
      id: TOAST_ERRO_CARREGAMENTO_ID,
      variant: 'destructive',
      title: 'Erro ao carregar definição do polo',
      description: (definicaoQuery.error as ErroApi).response?.data.detalhe,
    })
  }, [definicaoQuery.error, definicaoQuery.isError, showToast])

  const salvando = atualizacaoMutation.isPending
  const valoresFormulario = useWatch({ control: form.control })
  const projecaoInscritos = useWatch({
    control: form.control,
    name: 'projecaoInscritos',
  })
  const projecaoNumerica = Number(projecaoInscritos)
  const totalInscritos =
    Number.isFinite(projecaoNumerica) && projecaoNumerica >= 0
      ? Math.floor(projecaoNumerica * 1.3)
      : 0

  useEffect(() => {
    if (atualizacaoMutation.isError) {
      dismissToast(TOAST_ERRO_ATUALIZACAO_ID)
      atualizacaoMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- limpa o erro ao alterar qualquer campo
  }, [valoresFormulario])

  useEffect(() => {
    if (!atualizacaoMutation.error) return

    showToast({
      id: TOAST_ERRO_ATUALIZACAO_ID,
      variant: 'destructive',
      title: 'Erro ao salvar definição do polo',
      description: (atualizacaoMutation.error as ErroApi).response?.data
        .detalhe,
    })
  }, [atualizacaoMutation.error, showToast])

  function onSubmit(data: FormValues) {
    const detalhe = definicaoQuery.data
    if (!detalhe) return

    atualizacaoMutation.mutate(
      {
        polo: detalhe.polo.uuid,
        edicao: detalhe.edicao.uuid,
        tipo: detalhe.tipo,
        projecao_inscritos: Number(data.projecaoInscritos),
        ponto_focal_nome: data.pontoFocalNome,
        ponto_focal_telefone: data.pontoFocalTelefone,
        ponto_focal_email: data.pontoFocalEmail,
      },
      {
        onSuccess: () => {
          showToast({
            id: TOAST_SUCESSO_ATUALIZACAO_ID,
            variant: 'success',
            description: 'Definição do polo atualizada com sucesso!',
            duration: 3000,
          })
          navigate(ROTA_DEFINICOES_POLO, {
            state: { definicaoAtualizada: true },
          })
        },
      },
    )
  }

  function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    void form.handleSubmit(onSubmit)(event)
  }

  if (definicaoQuery.isPending) {
    return <IndicadorCarregamento mensagem="Carregando definição do polo..." />
  }

  if (!definicaoQuery.data) {
    return null
  }

  const { polo, resultado_final_de_inscritos } = definicaoQuery.data

  return (
    <form
      noValidate
      aria-label="Formulário de detalhamento do polo"
      onSubmit={handleFormSubmit}
      className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
    >
      <FieldGroup>
        <section
          aria-labelledby="secao-informacoes-gerais"
          className="grid gap-y-5.5"
        >
          <h4 id="secao-informacoes-gerais" className="font-bold">
            Informações Gerais
          </h4>

          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <CampoLeitura
              id="gestao"
              label="Tipo de Gestão"
              value={rotuloGestao(polo.gestao)}
            />
            <CampoLeitura
              id="codigoEol"
              label="Código EOL"
              value={polo.codigo_eol}
            />
            <CampoLeitura
              id="nomeUnidade"
              label="Nome da Unidade"
              value={polo.nome_polo}
            />
          </div>

          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
            <CampoLeitura
              id="tipoUnidade"
              label="Tipo de Unidade"
              value={polo.tipo_ue}
            />
            <CampoLeitura id="dre" label="DRE" value={polo.dre_nome} />
          </div>
        </section>

        <section aria-labelledby="secao-endereco" className="grid gap-y-5.5">
          <h4 id="secao-endereco" className="font-bold">
            Endereço
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
            <CampoLeitura
              id="cep"
              label="CEP"
              value={aplicarMascaraCep(polo.cep)}
            />
            <CampoLeitura
              id="endereco"
              label="Endereço"
              value={polo.endereco_completo}
            />
          </div>
        </section>

        <section aria-labelledby="secao-contato" className="grid gap-y-5.5">
          <h4 id="secao-contato" className="font-bold">
            Informações de contato
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <CampoLeitura
              id="nomeDiretorGestor"
              label="Nome do Diretor/Gestor"
              value={polo.nome_gestor}
            />
            <CampoLeitura
              id="emailPolo"
              label="E-mail do Polo"
              value={polo.email}
            />
            <CampoLeitura
              id="telefonePolo"
              label="Telefone do Polo"
              value={polo.telefone}
            />
          </div>
        </section>

        <section aria-labelledby="secao-ponto-focal" className="grid gap-y-5.5">
          <h4 id="secao-ponto-focal" className="font-bold">
            Ponto focal
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="pontoFocalNome"
              label="Nome"
              placeholder="Adicionar nome"
            />
            <FormField
              control={form.control}
              name="pontoFocalTelefone"
              label="Telefone"
              type="tel"
              placeholder="(00) 0000-0000"
              autoComplete="tel"
            />
            <FormField
              control={form.control}
              name="pontoFocalEmail"
              label="Email"
              type="email"
              placeholder="e-mail@e-mail.com"
            />
          </div>
        </section>

        <section aria-labelledby="secao-capacidade" className="grid gap-y-5.5">
          <h4 id="secao-capacidade" className="font-bold">
            Capacidade
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="projecaoInscritos"
              label="Projeção de inscritos"
              type="number"
              placeholder="Insira a projeção de inscritos"
              inputMode="numeric"
            />
            <CampoLeitura
              id="totalInscritos"
              label="Total de Inscritos"
              value={String(totalInscritos)}
            />
            <CampoLeitura
              id="resultadoRealInscritos"
              label="Resultado final de inscritos"
              value={String(resultado_final_de_inscritos)}
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button
            type="button"
            variant="outline"
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
            onClick={() => navigate(ROTA_DEFINICOES_POLO)}
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
