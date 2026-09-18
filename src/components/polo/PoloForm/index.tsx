import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { SearchIcon } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type SubmitEvent,
} from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useGetDadosDaUnidade } from '@/hooks/useGetDadosDaUnidade'
import { useGetPolo } from '@/hooks/useGetPolo'
import { usePostPolo } from '@/hooks/usePostPolo'
import { usePutPolo } from '@/hooks/usePutPolo'
import { useToast } from '@/hooks/useToast'
import { aplicarMascaraCep } from '@/utils/mascarasEntrada'

const TIPO_POLO_PADRAO = 'pendente' as const
const GESTAO_POLO_PADRAO = 'parceira' as const
const TOAST_ERRO_CADASTRO_ID = 'erro-cadastro-polo-parceiro'
const TOAST_EOL_NAO_ENCONTRADO_ID = 'eol-nao-encontrado'
const MENSAGEM_EOL_NAO_ENCONTRADO =
  'EOL não encontrado. Favor entrar em contato com a DRE'
const CLASSE_CAMPO_SOMENTE_LEITURA =
  'h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder'
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
  const dadosEdicaoRef = useRef<FormValues | null>(null)

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

  function limparCamposDaUnidade() {
    form.reset({
      ...form.getValues(),
      ...CAMPOS_DA_UNIDADE_VAZIOS,
    })
    setCodigoEolSincronizado(null)
    setEmailRetornado('')
    consultaUnidade.reset()
  }

  function consultarUnidade() {
    const codigoEol = form.getValues('codigoEol').trim()

    if (codigoEol.length < 6 || codigoEol.length > 7) {
      void form.trigger('codigoEol')
      return
    }

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
      },
      onError: () => {
        form.reset({
          ...form.getValues(),
          ...CAMPOS_DA_UNIDADE_VAZIOS,
        })
        setCodigoEolSincronizado(null)
        setEmailRetornado('')
        showToast({
          id: TOAST_EOL_NAO_ENCONTRADO_ID,
          variant: 'destructive',
          description: MENSAGEM_EOL_NAO_ENCONTRADO,
        })
      },
    })
  }

  function handleCodigoEolChange(valor: string) {
    if (
      codigoEolSincronizado !== null &&
      valor.trim() !== codigoEolSincronizado
    ) {
      limparCamposDaUnidade()
      dismissToast(TOAST_EOL_NAO_ENCONTRADO_ID)
      return
    }

    if (consultaUnidade.isError) {
      consultaUnidade.reset()
      dismissToast(TOAST_EOL_NAO_ENCONTRADO_ID)
    }
  }

  function handleCodigoEolKeyDown(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== 'Enter') return

    evento.preventDefault()
    consultarUnidade()
  }

  function onSubmit(data: FormValues) {
    if (poloId) {
      dadosEdicaoRef.current = data
      setConfirmacaoAberta(true)
      return
    }

    cadastroMutation.mutate(data, {
      onSuccess: () => {
        navigate('/polos-parceiros', { state: { poloCadastrado: true } })
      },
    })
  }

  // adia a leitura do ref para o momento do submit, evitando acesso durante o render
  function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    form.handleSubmit(onSubmit)(event)
  }

  function confirmarEdicao() {
    const dados = dadosEdicaoRef.current
    if (!dados) return

    setConfirmacaoAberta(false)
    atualizacaoMutation.mutate(dados, {
      onSuccess: () => {
        navigate('/polos-parceiros', { state: { poloAtualizado: true } })
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
              <Controller
                name="tipo"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="tipo" className="font-bold">
                      Tipo
                    </FieldLabel>
                    <Input
                      {...field}
                      id="tipo"
                      readOnly
                      aria-readonly="true"
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                  </Field>
                )}
              />

              {poloId ? (
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="status" className="font-bold">
                        Status
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="status"
                          aria-invalid={fieldState.invalid}
                          className="h-10 w-full min-w-0 rounded-sm border-input-border-muted data-[size=default]:h-10"
                        >
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : null}
            </div>

            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
              <Controller
                name="codigoEol"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="codigoEol" className="font-bold">
                      Código EOL
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id="codigoEol"
                        placeholder="Digite o código EOL"
                        aria-invalid={fieldState.invalid}
                        className="h-10 rounded-sm border-input-border-muted"
                        onChange={(evento) => {
                          field.onChange(evento)
                          handleCodigoEolChange(evento.target.value)
                        }}
                        onKeyDown={handleCodigoEolKeyDown}
                      />
                      <Button
                        type="button"
                        size="icon"
                        aria-label={
                          consultandoUnidade
                            ? 'Consultando código EOL'
                            : 'Consultar código EOL'
                        }
                        className="h-10 w-10 shrink-0 rounded-sm p-1.5!"
                        disabled={consultandoUnidade}
                        onClick={consultarUnidade}
                      >
                        {consultandoUnidade ? (
                          <Spinner />
                        ) : (
                          <SearchIcon className="size-5" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="nomeOsc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nomeOsc" className="font-bold">
                      Nome da OSC
                    </FieldLabel>
                    <Input
                      {...field}
                      id="nomeOsc"
                      placeholder="Digite o nome da OSC"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="nomePolo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nomePolo" className="font-bold">
                      Nome do Polo
                    </FieldLabel>
                    <Input
                      {...field}
                      id="nomePolo"
                      readOnly
                      aria-readonly="true"
                      placeholder="Nome preenchido pelo código EOL"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <Controller
                name="dreNome"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dre" className="font-bold">
                      DRE
                    </FieldLabel>
                    <Input
                      {...field}
                      id="dre"
                      readOnly
                      aria-readonly="true"
                      placeholder="DRE preenchida pelo código EOL"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tipoUe"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tipoUe" className="font-bold">
                      Tipo de UE
                    </FieldLabel>
                    <Input
                      {...field}
                      id="tipoUe"
                      readOnly
                      aria-readonly="true"
                      placeholder="Tipo preenchido pelo código EOL"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="quantidadeMaximaAlunos"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="quantidadeMaximaAlunos"
                      className="font-bold"
                    >
                      Quantidade máxima de alunos
                    </FieldLabel>
                    <Input
                      {...field}
                      id="quantidadeMaximaAlunos"
                      type="text"
                      inputMode="numeric"
                      placeholder="Digite a quantidade"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </section>

          <section aria-labelledby="secao-endereco" className="grid gap-y-5.5">
            <h4 id="secao-endereco" className="font-bold">
              Endereço
            </h4>
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
              <Controller
                name="cep"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="cep" className="font-bold">
                      CEP
                    </FieldLabel>
                    <Input
                      {...field}
                      id="cep"
                      readOnly
                      aria-readonly="true"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tipoLogradouro"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tipoLogradouro" className="font-bold">
                      Tipo de logradouro
                    </FieldLabel>
                    <Input
                      {...field}
                      id="tipoLogradouro"
                      readOnly
                      aria-readonly="true"
                      placeholder="Ex.: Rua, Avenida"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="logradouro"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="logradouro" className="font-bold">
                    Logradouro
                  </FieldLabel>
                  <Input
                    {...field}
                    id="logradouro"
                    readOnly
                    aria-readonly="true"
                    placeholder="Digite o logradouro"
                    aria-invalid={fieldState.invalid}
                    className={CLASSE_CAMPO_SOMENTE_LEITURA}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <Controller
                name="bairro"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bairro" className="font-bold">
                      Bairro
                    </FieldLabel>
                    <Input
                      {...field}
                      id="bairro"
                      readOnly
                      aria-readonly="true"
                      placeholder="Digite o bairro"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="numero"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="numero" className="font-bold">
                      Número
                    </FieldLabel>
                    <Input
                      {...field}
                      id="numero"
                      readOnly
                      aria-readonly="true"
                      placeholder="Digite o número"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="complemento"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="complemento" className="font-bold">
                      Complemento
                    </FieldLabel>
                    <Input
                      {...field}
                      id="complemento"
                      readOnly
                      aria-readonly="true"
                      placeholder="Digite o complemento"
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                  </Field>
                )}
              />
            </div>
          </section>

          <section aria-labelledby="secao-contato" className="grid gap-y-5.5">
            <h4 id="secao-contato" className="font-bold">
              Informações de contato
            </h4>
            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <Controller
                name="nomeGestor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nomeGestor" className="font-bold">
                      Nome do gestor
                    </FieldLabel>
                    <Input
                      {...field}
                      id="nomeGestor"
                      placeholder="Digite o nome do gestor"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email" className="font-bold">
                      E-mail do Polo
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      readOnly={!emailEditavel}
                      aria-readonly={emailEditavel ? undefined : 'true'}
                      placeholder="Digite o e-mail oficial do polo"
                      aria-invalid={fieldState.invalid}
                      className={
                        emailEditavel
                          ? 'h-10 rounded-sm border-input-border-muted'
                          : CLASSE_CAMPO_SOMENTE_LEITURA
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="telefone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="telefone" className="font-bold">
                      Telefone do Polo
                    </FieldLabel>
                    <Input
                      {...field}
                      id="telefone"
                      readOnly
                      aria-readonly="true"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      aria-invalid={fieldState.invalid}
                      className={CLASSE_CAMPO_SOMENTE_LEITURA}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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
            <Controller
              name="observacoesGerais"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="observacoesGerais" className="font-bold">
                    Observações Gerais
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="observacoesGerais"
                    placeholder="Digite observações e comentários"
                    className="rounded-sm border-input-border-muted"
                  />
                </Field>
              )}
            />
          </section>

          <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
            <Button
              type="button"
              variant="outline"
              className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
              onClick={() => navigate('/polos-parceiros')}
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
