import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { useForm, type Control } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FormFieldEol } from './index'

const schema = z.object({
  codigoEol: z
    .string()
    .trim()
    .min(6, 'Código EOL é obrigatório e não pode ser menor que 6 caracteres'),
})

type Campos = z.infer<typeof schema>

function FormularioTeste({
  children,
  onSubmit = vi.fn(),
}: {
  children: (control: Control<Campos>) => ReactNode
  onSubmit?: () => void
}) {
  const form = useForm<Campos>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigoEol: '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {children(form.control)}
      <button type="submit">Enviar</button>
    </form>
  )
}

describe('FormFieldEol', () => {
  it('renderiza o rótulo, o placeholder e o botão de consulta', () => {
    render(
      <FormularioTeste>
        {(control) => (
          <FormFieldEol control={control} name="codigoEol" onSearch={vi.fn()} />
        )}
      </FormularioTeste>,
    )

    expect(screen.getByLabelText('Código EOL')).toHaveAttribute(
      'placeholder',
      'Digite o código EOL',
    )
    expect(
      screen.getByRole('button', { name: 'Consultar código EOL' }),
    ).toBeEnabled()
  })

  it('consulta ao clicar na lupa', async () => {
    const usuario = userEvent.setup()
    const onSearch = vi.fn()

    render(
      <FormularioTeste>
        {(control) => (
          <FormFieldEol
            control={control}
            name="codigoEol"
            onSearch={onSearch}
          />
        )}
      </FormularioTeste>,
    )

    await usuario.click(
      screen.getByRole('button', { name: 'Consultar código EOL' }),
    )

    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('consulta ao pressionar Enter sem enviar o formulário', async () => {
    const usuario = userEvent.setup()
    const onSearch = vi.fn()
    const onSubmit = vi.fn()

    render(
      <FormularioTeste onSubmit={onSubmit}>
        {(control) => (
          <FormFieldEol
            control={control}
            name="codigoEol"
            onSearch={onSearch}
          />
        )}
      </FormularioTeste>,
    )

    await usuario.type(screen.getByLabelText('Código EOL'), '123456{Enter}')

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Código EOL')).toHaveValue('123456')
  })

  it('notifica a mudança do código', async () => {
    const usuario = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FormularioTeste>
        {(control) => (
          <FormFieldEol
            control={control}
            name="codigoEol"
            onSearch={vi.fn()}
            onChange={onChange}
          />
        )}
      </FormularioTeste>,
    )

    await usuario.type(screen.getByLabelText('Código EOL'), '12')

    expect(onChange).toHaveBeenCalledWith('1')
    expect(onChange).toHaveBeenCalledWith('12')
  })

  it('mostra o estado de carregamento no botão de consulta', () => {
    render(
      <FormularioTeste>
        {(control) => (
          <FormFieldEol
            control={control}
            name="codigoEol"
            onSearch={vi.fn()}
            isLoading
          />
        )}
      </FormularioTeste>,
    )

    expect(
      screen.getByRole('button', { name: 'Consultando código EOL' }),
    ).toBeDisabled()
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('exibe o erro de validação ao enviar o formulário', async () => {
    const usuario = userEvent.setup()

    render(
      <FormularioTeste>
        {(control) => (
          <FormFieldEol control={control} name="codigoEol" onSearch={vi.fn()} />
        )}
      </FormularioTeste>,
    )

    await usuario.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Código EOL é obrigatório e não pode ser menor que 6 caracteres',
    )
  })
})
