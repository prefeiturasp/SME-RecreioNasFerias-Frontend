import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { extrairDigitos } from '@/utils/mascarasEntrada'
import { SearchIcon } from 'lucide-react'
import React, { type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

export type FormFieldEolProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: ReactNode
  placeholder?: string
  onSearch?: (valor: string) => void
  onChange?: (value: string) => void
  isLoading?: boolean
  readOnly?: boolean
  labelClassName?: string
  buscaInterna?: boolean
  buscarAoSair?: boolean
  maxLength?: number
  rotuloBusca?: string
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
  readOnly = false,
  labelClassName = 'font-bold',
  buscaInterna = false,
  buscarAoSair = false,
  maxLength = 7,
  rotuloBusca = 'código EOL',
}: Readonly<FormFieldEolProps<TFieldValues, TName>>): React.JSX.Element {
  const rotuloAcao = isLoading
    ? `Consultando ${rotuloBusca}`
    : `Consultar ${rotuloBusca}`
  const handleKeyDown = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly || evento.key !== 'Enter') return

    evento.preventDefault()
    onSearch?.(evento.currentTarget.value)
  }
  const handleMouseDown = (evento: MouseEvent<HTMLButtonElement>) => {
    if (buscarAoSair) evento.preventDefault()
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        let inputClassName = 'h-10 rounded-sm border-input-border-muted'
        if (readOnly) {
          inputClassName =
            'h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder'
        } else if (buscaInterna) {
          inputClassName = 'h-10 rounded-sm border-input-border-muted pl-9'
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={String(name)} className={labelClassName}>
              {label}
            </FieldLabel>
            <div className={buscaInterna ? 'relative' : 'flex gap-2'}>
              {buscaInterna ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={rotuloAcao}
                  className="absolute top-1/2 left-1 z-10 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                  disabled={readOnly || isLoading}
                  onMouseDown={handleMouseDown}
                  onClick={() => {
                    if (readOnly) return
                    onSearch?.(field.value)
                  }}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <SearchIcon className="size-4" aria-hidden="true" />
                  )}
                </Button>
              ) : null}
              <Input
                {...field}
                id={String(name)}
                inputMode="numeric"
                maxLength={maxLength}
                placeholder={placeholder}
                readOnly={readOnly}
                aria-readonly={readOnly ? 'true' : undefined}
                aria-invalid={fieldState.invalid}
                className={inputClassName}
                onChange={(evento) => {
                  if (readOnly) return
                  const valor = extrairDigitos(evento.target.value).slice(
                    0,
                    maxLength,
                  )
                  field.onChange(valor)
                  onChange?.(valor)
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  field.onBlur()
                  if (readOnly || !buscarAoSair || !field.value) return
                  onSearch?.(field.value)
                }}
              />
              {buscaInterna ? null : (
                <Button
                  type="button"
                  size="icon"
                  aria-label={rotuloAcao}
                  className="h-10 w-10 shrink-0 rounded-sm p-1.5!"
                  disabled={readOnly || isLoading}
                  onMouseDown={handleMouseDown}
                  onClick={() => {
                    if (readOnly) return
                    onSearch?.(field.value)
                  }}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <SearchIcon className="size-5" aria-hidden="true" />
                  )}
                </Button>
              )}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
