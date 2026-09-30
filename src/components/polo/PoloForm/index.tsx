import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { useEffect, useState, type SubmitEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { FormField } from '@/components/ui/form-field'
import { FormFieldEol } from '@/components/ui/form-field-eol'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useGetDadosDaUnidade } from '@/hooks/useGetDadosDaUnidade'
import { useGetPolo } from '@/hooks/useGetPolo'
import { usePostPolo } from '@/hooks/usePostPolo'
import { usePutPolo } from '@/hooks/usePutPolo'
import { useToast } from '@/hooks/useToast'
import { aplicarMascaraCep } from '@/utils/mascarasEntrada'

const ROTA_POLOS_PARCEIROS = '/polos-parceiros'
const TIPO_POLO_PADRAO = 'pendente' as const
const GESTAO_POLO_PADRAO = 'parceira' as const
const TOAST_ERRO_CADASTRO_ID = 'erro-cadastro-polo-parceiro'
const TOAST_EOL_NAO_ENCONTRADO_ID = 'eol-nao-encontrado'
const MENSAGEM_EOL_NAO_ENCONTRADO =
  'EOL não encontrado. Favor entrar em contato com a DRE'
const CAMPOS_DA_UNIDADE_VAZIOS = {
  nomePolo: '',
  dreNome: '',
  dreCodigoEol: '',
  tipoUe: '',
  cep: '',
  tipoLogradouro: '',
  logradouro: '',
  bairro: '',
  numero: '',
  complemento: '',
  email: '',
  telefone: '',
}
type ErroApi = AxiosError<{ detalhe: string }>

type PoloFormProps = {
  poloId?: string
}

export function PoloForm({ poloId }: Readonly<PoloFormProps>) {
  const navigate = useNavigate()
  const { dismissToast, showToast } = useToast()
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)
  const [codigoEolSincronizado, setCodigoEolSincronizado] = useState<
    string | null
  >(null)
  const [emailRetornado, setEmailRetornado] = useState('')
  const [telefoneRetornado, setTelefoneRetornado] = useState('')
  const [dadosEdicaoPendente, setDadosEdicaoPendente] =
    useState<FormValues | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: TIPO_POLO_PADRAO,
      gestao: GESTAO_POLO_PADRAO,
      codigoEol: '',
      nomeOsc: '',
      nomePolo: '',
      dreNome: '',
      dreCodigoEol: '',
      tipoUe: '',
      quantidadeMaximaAlunos: '',
      cep: '',
      tipoLogradouro: '',
      logradouro: '',
      bairro: '',
      numero: '',
      complemento: '',
      nomeGestor: '',
      email: '',
      telefone: '',
      status: 'ativo',
      observacoesGerais: '',
    },
  })

  const poloQuery = useGetPolo(poloId)
  const consultaUnidade = useGetDadosDaUnidade()
  const cadastroMutation = usePostPolo()
  const atualizacaoMutation = usePutPolo(poloId)

  useEffect(() => {
    if (!poloQuery.data) return

    setCodigoEolSincronizado(poloQuery.data.codigo_eol)
    setEmailRetornado(poloQuery.data.email)
    setTelefoneRetornado(poloQuery.data.telefone)
    form.reset({
      tipo: poloQuery.data.tipo,
      gestao: poloQuery.data.gestao,
      codigoEol: poloQuery.data.codigo_eol,
      nomeOsc: poloQuery.data.nome_osc,
      nomePolo: poloQuery.data.nome_polo,
      dreNome: poloQuery.data.dre_nome,
      dreCodigoEol: poloQuery.data.dre_codigo_eol,
      tipoUe: poloQuery.data.tipo_ue,
      quantidadeMaximaAlunos: String(poloQuery.data.quantidade_maxima_alunos),
      cep: aplicarMascaraCep(poloQuery.data.cep),
      tipoLogradouro: poloQuery.data.tipo_logradouro,
      logradouro: poloQuery.data.logradouro,
      bairro: poloQuery.data.bairro,
      numero: poloQuery.data.numero,
      complemento: poloQuery.data.complemento,
      nomeGestor: poloQuery.data.nome_gestor,
      email: poloQuery.data.email,
      telefone: poloQuery.data.telefone,
      status: poloQuery.data.status,
      observacoesGerais: poloQuery.data.observacoes_gerais,
    })
  }, [poloQuery.data, form])

  const salvando = cadastroMutation.isPending || atualizacaoMutation.isPending
  const consultandoUnidade = consultaUnidade.isPending
  const emailEditavel =
    codigoEolSincronizado !== null && emailRetornado.trim().length === 0
  const telefoneEditavel =
    codigoEolSincronizado !== null && telefoneRetornado.trim().length === 0
  const valoresFormulario = useWatch({ control: form.control })

  useEffect(() => {
    if (cadastroMutation.isError) {
      dismissToast(TOAST_ERRO_CADASTRO_ID)
      cadastroMutation.reset()
    }
    if (atualizacaoMutation.isError) {
      atualizacaoMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda a cada alteração de qualquer campo, para limpar o erro de mutation anterior
  }, [valoresFormulario])

  useEffect(() => {
    if (poloId || !cadastroMutation.error) return

    showToast({
      id: TOAST_ERRO_CADASTRO_ID,
      variant: 'destructive',
      title: 'Erro ao cadastrar polo parceiro',
      description: (cadastroMutation.error as ErroApi).response?.data.detalhe,
    })
  }, [cadastroMutation.error, poloId, showToast])

  function resetarCamposDaUnidade() {
    form.reset({
      ...form.getValues(),
      ...CAMPOS_DA_UNIDADE_VAZIOS,
    })
    setCodigoEolSincronizado(null)
    setEmailRetornado('')
    setTelefoneRetornado('')
  }

  function limparCamposDaUnidade() {
    resetarCamposDaUnidade()
    consultaUnidade.reset()
  }

  function consultarUnidade() {
    const codigoEol = form.getValues('codigoEol').trim()

    void form.trigger('codigoEol').then((valido) => {
      if (!valido) return

      dismissToast(TOAST_EOL_NAO_ENCONTRADO_ID)
      consultaUnidade.mutate(codigoEol, {
        onSuccess: (unidade) => {
          form.reset({
            ...form.getValues(),
            nomePolo: unidade.nome,
            dreNome: unidade.nome_dre,
            dreCodigoEol: unidade.codigo_dre,
            tipoUe: unidade.sigla_tipo_escola,
            cep: unidade.cep,
            tipoLogradouro: unidade.tipo_logradouro,
            logradouro: unidade.logradouro,
            bairro: unidade.bairro,
            numero: unidade.numero,
            complemento: unidade.complemento,
            email: unidade.email,
            telefone: unidade.telefone,
          })
          setCodigoEolSincronizado(unidade.codigo_eol)
          setEmailRetornado(unidade.email)
          setTelefoneRetornado(unidade.telefone)
        },
        onError: () => {
          resetarCamposDaUnidade()
          showToast({
            id: TOAST_EOL_NAO_ENCONTRADO_ID,
            variant: 'destructive',
            description: MENSAGEM_EOL_NAO_ENCONTRADO,
          })
        },
      })
    })
  }

  function handleCodigoEolChange(valor: string) {
    const codigoAlteradoAposConsulta =
      codigoEolSincronizado !== null && valor.trim() !== codigoEolSincronizado

    if (codigoAlteradoAposConsulta) {
      limparCamposDaUnidade()
    } else if (consultaUnidade.isError) {
      consultaUnidade.reset()
    } else {
      return
    }

    dismissToast(TOAST_EOL_NAO_ENCONTRADO_ID)
  }

  function onSubmit(data: FormValues) {
    if (poloId) {
      setDadosEdicaoPendente(data)
      setConfirmacaoAberta(true)
      return
    }

    cadastroMutation.mutate(data, {
      onSuccess: () => {
        navigate(ROTA_POLOS_PARCEIROS, { state: { poloCadastrado: true } })
      },
    })
  }

  function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    form.handleSubmit(onSubmit)(event)
  }

  function confirmarEdicao() {
    if (!dadosEdicaoPendente) return

    setConfirmacaoAberta(false)
    atualizacaoMutation.mutate(dadosEdicaoPendente, {
      onSuccess: () => {
        setDadosEdicaoPendente(null)
        navigate(ROTA_POLOS_PARCEIROS, { state: { poloAtualizado: true } })
      },
    })
  }

  if (poloId && poloQuery.isPending) {
    return <IndicadorCarregamento mensagem="Carregando polo parceiro..." />
  }

  if (poloId && !poloQuery.data) {
    return <AlertaErroApi erro={poloQuery.error} />
  }

  return (
    <>
      <form
        noValidate
        aria-label="Formulário de polo"
        onSubmit={handleFormSubmit}
        className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
      >
        <FieldGroup>
          {poloId ? <AlertaErroApi erro={atualizacaoMutation.error} /> : null}

          <section
            aria-labelledby="secao-informacoes-gerais"
            className="grid gap-y-5.5"
          >
            <h4 id="secao-informacoes-gerais" className="font-bold">
              Informações Gerais
            </h4>

            <div
              className={
                poloId ? 'grid gap-x-4 gap-y-5.5 lg:grid-cols-2' : undefined
              }
            >
              <FormField
                control={form.control}
                name="tipo"
                label="Tipo"
                readOnly
              />

              {poloId ? (
                <FormField
                  control={form.control}
                  name="status"
                  label="Status"
                  type="select"
                  options={[
                    { value: 'ativo', label: 'Ativo' },
                    { value: 'inativo', label: 'Inativo' },
                  ]}
                  placeholder="Selecione o status"
                />
              ) : null}
            </div>

            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
              <FormFieldEol
                control={form.control}
                name="codigoEol"
                label="Código EOL"
                placeholder="Digite o código EOL"
                onSearch={consultarUnidade}
                onChange={handleCodigoEolChange}
                isLoading={consultandoUnidade}
                readOnly={Boolean(poloId)}
              />
              <FormField
                control={form.control}
                name="nomeOsc"
                label="Nome da OSC"
                placeholder="Digite o nome da OSC"
              />
              <FormField
                control={form.control}
                name="nomePolo"
                label="Nome do Polo"
                placeholder="Nome preenchido pelo código EOL"
                readOnly
              />
            </div>

            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="dreNome"
                label="DRE"
                placeholder="DRE preenchida pelo código EOL"
                readOnly
              />
              <FormField
                control={form.control}
                name="tipoUe"
                label="Tipo de UE"
                placeholder="Tipo preenchido pelo código EOL"
                readOnly
              />
              <FormField
                control={form.control}
                name="quantidadeMaximaAlunos"
                label="Quantidade máxima de alunos"
                type="number"
                placeholder="Digite a quantidade"
              />
            </div>
          </section>

          <section aria-labelledby="secao-endereco" className="grid gap-y-5.5">
            <h4 id="secao-endereco" className="font-bold">
              Endereço
            </h4>
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="cep"
                label="CEP"
                placeholder="00000-000"
                inputMode="numeric"
                autoComplete="postal-code"
                readOnly
              />
              <FormField
                control={form.control}
                name="tipoLogradouro"
                label="Tipo de logradouro"
                placeholder="Ex.: Rua, Avenida"
                readOnly
              />
            </div>
            <FormField
              control={form.control}
              name="logradouro"
              label="Logradouro"
              placeholder="Digite o logradouro"
              readOnly
            />
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="bairro"
                label="Bairro"
                placeholder="Digite o bairro"
                readOnly
              />
              <FormField
                control={form.control}
                name="numero"
                label="Número"
                placeholder="Digite o número"
                readOnly
              />
              <FormField
                control={form.control}
                name="complemento"
                label="Complemento"
                placeholder="Digite o complemento"
                readOnly
              />
            </div>
          </section>

          <section aria-labelledby="secao-contato" className="grid gap-y-5.5">
            <h4 id="secao-contato" className="font-bold">
              Informações de contato
            </h4>
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="nomeGestor"
                label="Nome do gestor"
                placeholder="Digite o nome do gestor"
              />
              <FormField
                control={form.control}
                name="email"
                label="E-mail do Polo"
                type="email"
                placeholder="Digite o e-mail oficial do polo"
                readOnly={!emailEditavel}
              />
              <FormField
                control={form.control}
                name="telefone"
                label="Telefone do Polo"
                type="tel"
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                readOnly={!telefoneEditavel}
              />
            </div>
          </section>

          <section
            aria-labelledby="secao-observacoes"
            className="grid gap-y-5.5"
          >
            <h4 id="secao-observacoes" className="font-bold">
              Observações
            </h4>
            <FormField
              control={form.control}
              name="observacoesGerais"
              label="Observações Gerais"
              type="textarea"
              placeholder="Digite observações e comentários"
            />
          </section>

          <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
            <Button
              type="button"
              variant="outline"
              className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
              onClick={() => navigate(ROTA_POLOS_PARCEIROS)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
              disabled={salvando || consultaUnidade.isError}
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <Modal
        aberto={confirmacaoAberta}
        titulo="Salvar alterações"
        onOpenChange={setConfirmacaoAberta}
        acoes={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmacaoAberta(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={confirmarEdicao}>
              Salvar
            </Button>
          </>
        }
      >
        Deseja salvar as alterações realizadas no polo parceiro?
      </Modal>
    </>
  )
}
