import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../ui/combobox'
import { Label } from '../ui/label'

export type OpcaoFiltroCombobox = {
  value: string
  label: string
}

type CampoFiltroComboboxProps = {
  id: string
  rotulo: string
  placeholder: string
  valor: string
  opcoes: OpcaoFiltroCombobox[]
  onValorChange: (valor: string) => void
}

export function CampoFiltroCombobox({
  id,
  rotulo,
  placeholder,
  valor,
  opcoes,
  onValorChange,
}: Readonly<CampoFiltroComboboxProps>) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="font-bold">
        {rotulo}
      </Label>
      <Combobox
        items={opcoes}
        value={opcoes.find((opcao) => opcao.value === valor) ?? null}
        onValueChange={(opcao) => onValorChange(opcao?.value ?? '')}
        itemToStringLabel={(opcao) => opcao.label}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          showClear
          className="h-10! rounded-sm border-input-border-muted"
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>Nenhuma opção encontrada.</ComboboxEmpty>
            <ComboboxCollection>
              {(opcao) => (
                <ComboboxItem key={opcao.value} value={opcao}>
                  {opcao.label}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
