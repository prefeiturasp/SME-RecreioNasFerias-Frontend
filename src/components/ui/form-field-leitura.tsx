import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type FormFieldLeituraProps = {
  id: string
  label: string
  value: string
}

export function FormFieldLeitura({
  id,
  label,
  value,
}: Readonly<FormFieldLeituraProps>) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="font-bold">
        {label}
      </FieldLabel>
      <Input
        id={id}
        value={value}
        readOnly
        aria-readonly="true"
        className="h-10 cursor-not-allowed rounded-sm border-input-border-muted bg-input-disabled-bg text-placeholder"
      />
    </Field>
  )
}
