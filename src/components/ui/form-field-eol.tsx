import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { extrairDigitos } from '@/utils/mascarasEntrada'
import { SearchIcon } from 'lucide-react'
import React, { type MouseEvent, type ReactNode } from 'react'
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
  buscarAoSair?: boolean
  maxLength?: number
  maxLengthExibicao?: number
  rotuloBusca?: string
  formatarExibicao?: (valor: string) => string
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
  buscarAoSair = false,
  maxLength = 7,
  maxLengthExibicao,
  rotuloBusca = 'código EOL',
  formatarExibicao,
}: Readonly<FormFieldEolProps<TFieldValues, TName>>): React.JSX.Element {
  const rotuloAcao = isLoading
    ? `Consultando ${rotuloBusca}`
    : `Consultar ${rotuloBusca}`
  const handleMouseDown = (evento: MouseEvent<HTMLButtonElement>) => {
    if (buscarAoSair) evento.preventDefault()
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const digitos = String(field.value ?? '')
        const valorExibido = formatarExibicao
          ? formatarExibicao(digitos)
          : digitos
        const inputClassName = readOnly
          ? 'h-full! w-auto! min-w-0 flex-1 cursor-not-allowed rounded-none! border-0! bg-input-disabled-bg px-3 text-placeholder shadow-none focus-visible:border-transparent focus-visible:ring-0!'
          : 'h-full! w-auto! min-w-0 flex-1 rounded-none! border-0! bg-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0!'

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={String(name)} className={labelClassName}>
              {label}
            </FieldLabel>
            <div className="flex h-10 overflow-hidden rounded-sm border border-input-border-muted focus-within:border-ring">
              <Input
                {...field}
                id={String(name)}
                inputMode="numeric"
                maxLength={maxLengthExibicao ?? maxLength}
                placeholder={placeholder}
                readOnly={readOnly}
                aria-readonly={readOnly ? 'true' : undefined}
                aria-invalid={fieldState.invalid}
                className={inputClassName}
                value={valorExibido}
                onChange={(evento) => {
                  if (readOnly) return
                  const valor = extrairDigitos(evento.target.value).slice(
                    0,
                    maxLength,
                  )
                  field.onChange(valor)
                  onChange?.(valor)
                }}
                onKeyDown={(evento) => {
                  if (readOnly || !onSearch || evento.key !== 'Enter') return
                  evento.preventDefault()
                  onSearch(
                    extrairDigitos(evento.currentTarget.value).slice(
                      0,
                      maxLength,
                    ),
                  )
                }}
                onBlur={(evento) => {
                  field.onBlur()
                  if (readOnly || !buscarAoSair) return
                  const valor = extrairDigitos(
                    evento.currentTarget.value,
                  ).slice(0, maxLength)
                  if (!valor) return
                  onSearch?.(valor)
                }}
              />
              {onSearch ? (
                <Button
                  type="button"
                  size="icon"
                  aria-label={rotuloAcao}
                  className="h-full! w-10! shrink-0 rounded-none! border-0! p-1.5!"
                  disabled={readOnly || isLoading}
                  onMouseDown={handleMouseDown}
                  onClick={() => {
                    if (readOnly) return
                    onSearch(digitos)
                  }}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <SearchIcon className="size-5" aria-hidden="true" />
                  )}
                </Button>
              ) : null}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
