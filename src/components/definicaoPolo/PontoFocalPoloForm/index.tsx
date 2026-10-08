import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { useEffect, type SubmitEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  pontoFocalSchema,
  type PontoFocalFormValues,
} from '../DefinicaoPoloForm/schema'

import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { FormFieldLeitura } from '@/components/ui/form-field-leitura'
import { useGetPolo } from '@/hooks/useGetPolo'
import { usePatchPontoFocalPolo } from '@/hooks/usePatchPontoFocalPolo'
import { useToast } from '@/hooks/useToast'
import type { GestaoPolo } from '@/services/polo/types'
import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '@/utils/mascarasEntrada'

const ROTA_DEFINICOES_POLO = '/definicoes-polo'
const TOAST_ERRO_CARREGAMENTO_ID = 'erro-carregamento-polo-sem-definicao'
const TOAST_ERRO_ATUALIZACAO_ID = 'erro-atualizacao-ponto-focal-polo'
const TOAST_SUCESSO_ATUALIZACAO_ID = 'sucesso-atualizacao-ponto-focal-polo'

type ErroApi = AxiosError<{ detalhe: string }>

function rotuloGestao(gestao: GestaoPolo) {
  return gestao === 'direta' ? 'Direta' : 'Parceira'
}

export function PontoFocalPoloForm({
  poloUuid,
}: Readonly<{ poloUuid: string }>) {
  const navigate = useNavigate()
  const { dismissToast, showToast } = useToast()
  const poloQuery = useGetPolo(poloUuid)
  const atualizacaoMutation = usePatchPontoFocalPolo(poloUuid)

  const form = useForm<PontoFocalFormValues>({
    resolver: zodResolver(pontoFocalSchema),
    defaultValues: {
      pontoFocalNome: '',
      pontoFocalTelefone: '',
      pontoFocalEmail: '',
    },
  })

  useEffect(() => {
    if (!poloQuery.data) return

    form.reset({
      pontoFocalNome: poloQuery.data.ponto_focal_nome,
      pontoFocalTelefone: poloQuery.data.ponto_focal_telefone
        ? aplicarMascaraTelefone(poloQuery.data.ponto_focal_telefone)
        : '',
      pontoFocalEmail: poloQuery.data.ponto_focal_email,
    })
  }, [form, poloQuery.data])

  useEffect(() => {
    if (!poloQuery.isError) return

    showToast({
      id: TOAST_ERRO_CARREGAMENTO_ID,
      variant: 'destructive',
      title: 'Erro ao carregar polo',
      description: (poloQuery.error as ErroApi).response?.data.detalhe,
    })
  }, [poloQuery.error, poloQuery.isError, showToast])

  useEffect(() => {
    if (!atualizacaoMutation.error) return

    showToast({
      id: TOAST_ERRO_ATUALIZACAO_ID,
      variant: 'destructive',
      title: 'Erro ao salvar ponto focal',
      description: (atualizacaoMutation.error as ErroApi).response?.data
        .detalhe,
    })
  }, [atualizacaoMutation.error, showToast])

  function onSubmit(dados: PontoFocalFormValues) {
    if (!poloQuery.data) return

    if (atualizacaoMutation.isError) {
      dismissToast(TOAST_ERRO_ATUALIZACAO_ID)
      atualizacaoMutation.reset()
    }

    atualizacaoMutation.mutate(
      {
        ponto_focal_nome: dados.pontoFocalNome,
        ponto_focal_telefone: dados.pontoFocalTelefone,
        ponto_focal_email: dados.pontoFocalEmail,
      },
      {
        onSuccess: () => {
          showToast({
            id: TOAST_SUCESSO_ATUALIZACAO_ID,
            variant: 'success',
            description: 'Ponto focal do polo atualizado com sucesso!',
            duration: 3000,
          })
          void navigate(ROTA_DEFINICOES_POLO, {
            state: { definicaoAtualizada: true },
          })
        },
      },
    )
  }

  function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    void form.handleSubmit(onSubmit)(event)
  }

  if (poloQuery.isPending) {
    return <IndicadorCarregamento mensagem="Carregando polo..." />
  }

  if (!poloQuery.data) {
    return null
  }

  const polo = poloQuery.data

  return (
    <form
      noValidate
      aria-label="Formulário de ponto focal do polo"
      onSubmit={handleFormSubmit}
      className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
    >
      <FieldGroup className="gap-8">
        <section
          aria-labelledby="secao-informacoes-gerais-polo"
          className="grid gap-y-5.5"
        >
          <h4
            id="secao-informacoes-gerais-polo"
            className="font-bold text-primary"
          >
            Informações Gerais
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <FormFieldLeitura
              id="gestaoPolo"
              label="Tipo de Gestão"
              value={rotuloGestao(polo.gestao)}
            />
            <FormFieldLeitura
              id="codigoEolPolo"
              label="Código EOL"
              value={polo.codigo_eol}
            />
            <FormFieldLeitura
              id="nomeUnidadePolo"
              label="Nome da Unidade"
              value={polo.nome_polo}
            />
          </div>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
            <FormFieldLeitura
              id="tipoUnidadePolo"
              label="Tipo de Unidade"
              value={polo.tipo_ue}
            />
            <FormFieldLeitura
              id="drePolo"
              label="DRE"
              value={polo.dre_nome}
            />
          </div>
        </section>

        <section
          aria-labelledby="secao-endereco-polo"
          className="grid gap-y-5.5"
        >
          <h4 id="secao-endereco-polo" className="font-bold text-primary">
            Endereço
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
            <FormFieldLeitura
              id="cepPolo"
              label="CEP"
              value={aplicarMascaraCep(polo.cep)}
            />
            <FormFieldLeitura
              id="enderecoPolo"
              label="Endereço"
              value={polo.endereco_completo}
            />
          </div>
        </section>

        <section
          aria-labelledby="secao-contato-polo"
          className="grid gap-y-5.5"
        >
          <h4 id="secao-contato-polo" className="font-bold text-primary">
            Informações de contato
          </h4>
          <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
            <FormFieldLeitura
              id="gestorPolo"
              label="Nome do Diretor/Gestor"
              value={polo.nome_gestor}
            />
            <FormFieldLeitura
              id="emailPolo"
              label="E-mail do Polo"
              value={polo.email}
            />
            <FormFieldLeitura
              id="telefonePolo"
              label="Telefone do Polo"
              value={polo.telefone}
            />
          </div>
        </section>

        <section
          aria-labelledby="secao-ponto-focal-polo"
          className="grid gap-y-5.5"
        >
          <h4 id="secao-ponto-focal-polo" className="font-bold text-primary">
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
            disabled={atualizacaoMutation.isPending}
          >
            {atualizacaoMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
