import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form'
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxChip,
  ComboboxCollection,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'

export type OpcaoSelecaoMultipla = {
  value: string
  label: string
}

type FormFieldMultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, OpcaoSelecaoMultipla[]>,
> = {
  control: Control<TFieldValues>
  name: TName
  label: React.ReactNode
  placeholder: string
  options: OpcaoSelecaoMultipla[]
  disabled?: boolean
  onChange?: (values: OpcaoSelecaoMultipla[]) => void
}

export function FormFieldMultiSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, OpcaoSelecaoMultipla[]>,
>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled = false,
  onChange,
}: Readonly<FormFieldMultiSelectProps<TFieldValues, TName>>) {
  const fieldId = String(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <Combobox<OpcaoSelecaoMultipla, true>
            multiple
            items={options}
            value={field.value}
            onValueChange={(values) => {
              field.onChange(values)
              onChange?.(values)
            }}
            itemToStringLabel={(option) => option.label}
            isItemEqualToValue={(option, value) => option.value === value.value}
            disabled={disabled}
          >
            <ComboboxChips
              aria-label="Deficiências selecionadas"
              className={cn(
                'min-h-10 w-full rounded-sm border-input-border-muted',
                disabled &&
                  'cursor-not-allowed bg-input-disabled-bg text-placeholder opacity-50',
              )}
            >
              <ComboboxValue>
                {(values) =>
                  values.map((option: OpcaoSelecaoMultipla) => (
                    <ComboboxChip
                      key={option.value}
                      aria-description="Opção selecionada"
                      removeLabel={`Remover ${option.label}`}
                    >
                      {option.label}
                    </ComboboxChip>
                  ))
                }
              </ComboboxValue>
              <ComboboxChipsInput
                id={fieldId}
                placeholder={placeholder}
                className="placeholder:text-muted-foreground"
                aria-invalid={fieldState.invalid}
                aria-description={
                  field.value.length > 0
                    ? `${field.value.length} opções selecionadas`
                    : undefined
                }
              />
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxList>
                <ComboboxCollection>
                  {(option) => (
                    <ComboboxItem key={option.value} value={option}>
                      {option.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
