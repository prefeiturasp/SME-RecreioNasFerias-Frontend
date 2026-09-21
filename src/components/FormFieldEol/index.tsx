import React from 'react'
import { SearchIcon } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { extrairDigitos } from '@/utils/mascarasEntrada'

export type FormFieldEolProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  onSearch: () => void
  onChange?: (value: string) => void
  isLoading?: boolean
  labelClassName?: string
}

/**
 * Componente especializado para o campo EOL com botão de busca
 *
 * @example
 * ```tsx
 * <FormFieldEol
 *   control={form.control}
 *   name="codigoEol"
 *   label="Código EOL"
 *   onSearch={consultarUnidade}
 *   isLoading={consultandoUnidade}
 * />
 * ```
 */
export function FormFieldEol<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label = 'Código EOL',
  placeholder = 'Digite o código EOL',
  onSearch,
  onChange,
  isLoading = false,
  labelClassName = 'font-bold',
}: FormFieldEolProps<TFieldValues, TName>): React.JSX.Element {
  const handleKeyDown = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key !== 'Enter') return

    evento.preventDefault()
    onSearch()
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={String(name)} className={labelClassName}>
            {label}
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              {...field}
              id={String(name)}
              inputMode="numeric"
              maxLength={7}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              className="h-10 rounded-sm border-input-border-muted"
              onChange={(evento) => {
                const valor = extrairDigitos(evento.target.value).slice(0, 7)
                field.onChange(valor)
                onChange?.(valor)
              }}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              size="icon"
              aria-label={
                isLoading ? 'Consultando código EOL' : 'Consultar código EOL'
              }
              className="h-10 w-10 shrink-0 rounded-sm p-1.5!"
              disabled={isLoading}
              onClick={onSearch}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <SearchIcon className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
