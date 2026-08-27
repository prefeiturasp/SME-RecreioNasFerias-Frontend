import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { useGetPolo } from '@/hooks/useGetPolo'
import { usePostPolo } from '@/hooks/usePostPolo'
import { usePutPolo } from '@/hooks/usePutPolo'
import { useOpcoesIntegracaoPolosParceiros } from '@/services/smeIntegracao/useOpcoesIntegracaoPolosParceiros'
import {
  aplicarMascaraCep,
  aplicarMascaraTelefone,
} from '@/utils/mascarasEntrada'

const TIPO_POLO_PADRAO = 'pendente' as const
const GESTAO_POLO_PADRAO = 'parceira' as const

type PoloFormProps = {
  poloId?: string
}

export function PoloForm({ poloId }: Readonly<PoloFormProps>) {
  const navigate = useNavigate()
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)
  const dadosEdicaoRef = useRef<FormValues | null>(null)
  const { opcoesDre, opcoesTipoUe, estaCarregando: estaCarregandoOpcoes } =
    useOpcoesIntegracaoPolosParceiros()

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
  const cadastroMutation = usePostPolo()
  const atualizacaoMutation = usePutPolo(poloId)

  useEffect(() => {
    if (!poloQuery.data) return

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
      telefone: aplicarMascaraTelefone(poloQuery.data.telefone),
      status: poloQuery.data.status,
      observacoesGerais: poloQuery.data.observacoes_gerais,
    })
  }, [poloQuery.data, form])

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

  function confirmarEdicao() {
    const dados = dadosEdicaoRef.current
    if (!dados) return

    setConfirmacaoAberta(false)
    atualizacaoMutation.mutate(dados, {
      onSuccess: () => {
        navigate('/polos-parceiros')
      },
    })
  }

  if (!poloId && estaCarregandoOpcoes) {
    return <IndicadorCarregamento mensagem="Carregando formulário..." />
  }

  if (poloId && (poloQuery.isPending || estaCarregandoOpcoes)) {
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
      >
        <FieldGroup>
          <AlertaErroApi
            erro={cadastroMutation.error ?? atualizacaoMutation.error}
          />

          <section aria-labelledby="secao-informacoes-gerais" className="grid gap-y-5.5">
            <h4 id="secao-informacoes-gerais" className="font-bold">
              Informações Gerais
            </h4>

            <div className={poloId ? 'grid gap-x-4 gap-y-5.5 lg:grid-cols-2' : undefined}>
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
                      className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
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
                    <Input
                      {...field}
                      id="codigoEol"
                      placeholder="Digite o código EOL"
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
                      placeholder="Digite o nome do polo"
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

            <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-3">
              <Controller
                name="dreCodigoEol"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dre" className="font-bold">
                      DRE
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(valor) => {
                        if (!valor) return
                        field.onChange(valor)
                        const dreSelecionada = opcoesDre.find(
                          (dre) => dre.codigo === valor,
                        )
                        form.setValue('dreNome', dreSelecionada?.nome ?? '', {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectTrigger
                        id="dre"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full min-w-0 rounded-sm border-input-border-muted data-[size=default]:h-10"
                      >
                        <SelectValue placeholder="Selecione a DRE" />
                      </SelectTrigger>
                      <SelectContent>
                        {opcoesDre.map((dre) => (
                          <SelectItem key={dre.codigo} value={dre.codigo}>
                            {dre.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={field.value}
                      onValueChange={(valor) => {
                        if (valor) field.onChange(valor)
                      }}
                    >
                      <SelectTrigger
                        id="tipoUe"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full min-w-0 rounded-sm border-input-border-muted data-[size=default]:h-10"
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {opcoesTipoUe.map((tipoUe) => (
                          <SelectItem
                            key={tipoUe.codigo}
                            value={tipoUe.descricaoSigla}
                          >
                            {tipoUe.descricaoSigla}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted"
                      onChange={(evento) =>
                        field.onChange(aplicarMascaraCep(evento.target.value))
                      }
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
                      placeholder="Ex.: Rua, Avenida"
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
                    placeholder="Digite o logradouro"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-sm border-input-border-muted"
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
                      placeholder="Digite o bairro"
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
                      placeholder="Digite o número"
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
                      placeholder="Digite o complemento"
                      className="h-10 rounded-sm border-input-border-muted"
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
                      placeholder="Digite o e-mail oficial do polo"
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
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-sm border-input-border-muted"
                      onChange={(evento) =>
                        field.onChange(
                          aplicarMascaraTelefone(evento.target.value),
                        )
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </section>

          <section aria-labelledby="secao-observacoes" className="grid gap-y-5.5">
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
              disabled={salvando}
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
