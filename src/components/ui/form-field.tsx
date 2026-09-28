import React from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

/**
 * Props base para todos os tipos de FormField
 */
type FormFieldBaseProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: string | ReactNode
  labelClassName?: string
  hideError?: boolean
  readOnly?: boolean
}

/**
 * Props para FormField do tipo Input
 */
type FormFieldInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FormFieldBaseProps<TFieldValues, TName> & {
  type?: 'input' | 'text' | 'email' | 'number' | 'tel' | 'password'
  placeholder?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  maxLength?: number
  inputClassName?: string
}

/**
 * Props para FormField do tipo Select
 */
type FormFieldSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FormFieldBaseProps<TFieldValues, TName> & {
  type: 'select'
  options: Array<{ value: string; label: string }>
  placeholder?: string
  disabled?: boolean
  triggerClassName?: string
  onChange?: (valor: string) => void
}

/**
 * Props para FormField do tipo Textarea
 */
type FormFieldRadioProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FormFieldBaseProps<TFieldValues, TName> & {
  type: 'radio'
  options: Array<{ value: string; label: string }>
  onChange?: (valor: string) => void
}

type FormFieldTextareaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = FormFieldBaseProps<TFieldValues, TName> & {
  type: 'textarea'
  placeholder?: string
  rows?: number
  textareaClassName?: string
}

/**
 * Union de todos os tipos de props possíveis
 */
export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> =
  | FormFieldInputProps<TFieldValues, TName>
  | FormFieldSelectProps<TFieldValues, TName>
  | FormFieldRadioProps<TFieldValues, TName>
  | FormFieldTextareaProps<TFieldValues, TName>

/**
 * Componente genérico que encapsula o padrão Controller + Field + Input/Select/Textarea
 *
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="email"
 *   label="Email"
 *   type="input"
 *   placeholder="Digite seu email"
 * />
 *
 * <FormField
 *   control={form.control}
 *   name="status"
 *   label="Status"
 *   type="select"
 *   options={[
 *     { value: 'ativo', label: 'Ativo' },
 *     { value: 'inativo', label: 'Inativo' },
 *   ]}
 * />
 * ```
 */
export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: FormFieldProps<TFieldValues, TName> &
    (
      | FormFieldInputProps<TFieldValues, TName>
      | FormFieldSelectProps<TFieldValues, TName>
      | FormFieldRadioProps<TFieldValues, TName>
      | FormFieldTextareaProps<TFieldValues, TName>
    ),
): React.JSX.Element {
  const {
    control,
    name,
    label,
    labelClassName = 'font-bold',
    hideError = false,
    readOnly = false,
  } = props
  const fieldId = String(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel
              id={`${fieldId}-rotulo`}
              htmlFor={fieldId}
              className={labelClassName}
            >
              {label}
            </FieldLabel>
          )}

          {renderInput(props, field, readOnly)}

          {!hideError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}

function renderInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: FormFieldProps<TFieldValues, TName>,
  field: ControllerRenderProps<TFieldValues, TName>,
  readOnly: boolean,
): React.JSX.Element {
  const { name } = props
  const fieldId = String(name)

  // Input
  if (
    props.type !== 'select' &&
    props.type !== 'textarea' &&
    props.type !== 'radio'
  ) {
    const {
      placeholder,
      inputMode,
      autoComplete,
      maxLength,
      inputClassName = 'h-10 rounded-sm border-input-border-muted',
    } = props

    const isReadOnlyField = readOnly || props.readOnly
    const readOnlyClass = isReadOnlyField
      ? 'h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder'
      : inputClassName

    // Determinar o tipo de input (padrão é 'text')
    const inputType = props.type && props.type !== 'input' ? props.type : 'text'

    return (
      <Input
        {...field}
        id={fieldId}
        type={inputType}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        readOnly={isReadOnlyField}
        aria-readonly={isReadOnlyField ? 'true' : undefined}
        className={readOnlyClass}
      />
    )
  }

  // Select
  if (props.type === 'select') {
    const {
      options,
      placeholder,
      disabled = false,
      triggerClassName,
      onChange,
    } = props

    return (
      <Select
        value={field.value}
        onValueChange={(valor) => {
          field.onChange(valor)
          onChange?.(valor)
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={fieldId}
          className={cn(
            'h-10 w-full min-w-0 rounded-sm border-input-border-muted data-[size=default]:h-10',
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (props.type === 'radio') {
    const { options, onChange } = props

    return (
      <RadioGroup
        id={fieldId}
        aria-labelledby={`${fieldId}-rotulo`}
        value={field.value}
        onValueChange={(valor) => {
          field.onChange(valor)
          onChange?.(valor)
        }}
        disabled={readOnly}
        className="flex flex-wrap gap-4"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`${String(name)}-${option.value}`}
            />
            <FieldLabel
              htmlFor={`${String(name)}-${option.value}`}
              className="font-normal"
            >
              {option.label}
            </FieldLabel>
          </div>
        ))}
      </RadioGroup>
    )
  }

  // Textarea
  if (props.type === 'textarea') {
    const {
      placeholder,
      rows = 4,
      textareaClassName = 'rounded-sm border-input-border-muted',
    } = props

    return (
      <Textarea
        {...field}
        id={fieldId}
        placeholder={placeholder}
        rows={rows}
        className={textareaClassName}
      />
    )
  }

  return <div>Tipo de campo não suportado</div>
}
