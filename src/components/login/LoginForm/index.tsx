import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { FormValues } from './schema'
import formSchema from './schema'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { usePostLogin } from '@/hooks/usePostLogin'
import { obterMensagemDeErroLogin } from './mensagensErro'

export function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: '',
      senha: '',
    },
  })

  const loginMutation = usePostLogin()

  function onSubmit(data: FormValues) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/inicio')
      },
    })
  }

  function limparErroDaMutation() {
    if (loginMutation.isError) {
      loginMutation.reset()
    }
  }

  const mensagemDeErro = loginMutation.isError
    ? obterMensagemDeErroLogin(loginMutation.error)
    : null

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">
      <FieldGroup>
        <Controller
          name="usuario"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="usuario" className="text-md font-normal">
                Usuário
              </FieldLabel>
              <Input
                {...field}
                id="usuario"
                autoComplete="username"
                aria-invalid={fieldState.invalid}
                className="py-6"
                onChange={(event) => {
                  limparErroDaMutation()
                  field.onChange(event)
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="senha"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="senha" className="text-md font-normal">
                Senha
              </FieldLabel>
              <Input
                {...field}
                id="senha"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="py-6"
                onChange={(event) => {
                  limparErroDaMutation()
                  field.onChange(event)
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="py-6"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Acessando...' : 'Acessar'}
        </Button>

        {mensagemDeErro && (
          <p role="alert" className="my-3 text-sm bg-[#f5f5f5] p-4 rounded-md">
            {mensagemDeErro}
          </p>
        )}

        <Button asChild variant="link" className="py-6">
          <a href="#recuperar-senha">Esqueci minha senha</a>
        </Button>
      </FieldGroup>
    </form>
  )
}
