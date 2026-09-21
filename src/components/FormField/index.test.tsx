import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { useForm, type Control } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { FormField } from './index'

const schema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  status: z.string().min(1, 'Status é obrigatório'),
  observacoes: z.string(),
})

type Campos = z.infer<typeof schema>

function FormularioTeste({
  children,
  defaultValues,
}: {
  children: (control: Control<Campos>) => ReactNode
  defaultValues?: Partial<Campos>
}) {
  const form = useForm<Campos>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      status: '',
      observacoes: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(() => undefined)}>
      {children(form.control)}
      <button type="submit">Enviar</button>
    </form>
  )
}

describe('FormField', () => {
  it('renderiza o rótulo e o campo de texto', () => {
    render(
      <FormularioTeste>
        {(control) => (
          <FormField
            control={control}
            name="nome"
            label="Nome"
            placeholder="Digite o nome"
          />
        )}
      </FormularioTeste>,
    )

    expect(screen.getByLabelText('Nome')).toHaveAttribute(
      'placeholder',
      'Digite o nome',
    )
    expect(screen.getByLabelText('Nome')).toHaveAttribute('type', 'text')
  })

  it('atualiza o valor digitado no input', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => <FormField control={control} name="nome" label="Nome" />}
      </FormularioTeste>,
    )

    await usuario.type(screen.getByLabelText('Nome'), 'Polo Teste')

    expect(screen.getByLabelText('Nome')).toHaveValue('Polo Teste')
  })

  it('aplica o tipo de input informado', () => {
    render(
      <FormularioTeste>
        {(control) => (
          <FormField
            control={control}
            name="nome"
            label="E-mail"
            type="email"
          />
        )}
      </FormularioTeste>,
    )

    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
  })

  it('marca o campo como somente leitura', () => {
    render(
      <FormularioTeste defaultValues={{ nome: 'Polo Teste' }}>
        {(control) => (
          <FormField control={control} name="nome" label="Nome" readOnly />
        )}
      </FormularioTeste>,
    )

    expect(screen.getByLabelText('Nome')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Nome')).toHaveAttribute(
      'aria-readonly',
      'true',
    )
  })

  it('exibe o erro de validação ao enviar o formulário', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => <FormField control={control} name="nome" label="Nome" />}
      </FormularioTeste>,
    )

    await usuario.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nome é obrigatório',
    )
  })

  it('omite o erro quando hideError está ativo', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => (
          <FormField control={control} name="nome" label="Nome" hideError />
        )}
      </FormularioTeste>,
    )

    await usuario.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renderiza o select e notifica a opção escolhida', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => (
          <FormField
            control={control}
            name="status"
            label="Status"
            type="select"
            placeholder="Selecione o status"
            options={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
            ]}
          />
        )}
      </FormularioTeste>,
    )

    await usuario.click(screen.getByLabelText('Status'))
    await usuario.click(await screen.findByRole('option', { name: 'Ativo' }))

    expect(screen.getByLabelText('Status')).toHaveTextContent('Ativo')
  })

  it('renderiza o textarea com o valor digitado', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => (
          <FormField
            control={control}
            name="observacoes"
            label="Observações"
            type="textarea"
            placeholder="Digite observações"
          />
        )}
      </FormularioTeste>,
    )

    const campo = screen.getByLabelText('Observações')

    expect(campo.tagName).toBe('TEXTAREA')
    await usuario.type(campo, 'Comentário do polo')
    expect(campo).toHaveValue('Comentário do polo')
  })
})
