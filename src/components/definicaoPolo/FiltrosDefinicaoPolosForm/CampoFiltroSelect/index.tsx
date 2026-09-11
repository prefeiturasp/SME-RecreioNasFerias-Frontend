import React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CampoFiltroSelectProps = {
  id: string
  rotulo: string
  placeholder: string
  valor: string
  onValorChange: (valor: string) => void
  children: React.ReactNode
}

export function CampoFiltroSelect({
  id,
  rotulo,
  placeholder,
  valor,
  onValorChange,
  children,
}: Readonly<CampoFiltroSelectProps>) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="font-bold">
        {rotulo}
      </Label>
      <Select
        key={valor || 'sem-filtro'}
        value={valor || undefined}
        onValueChange={(valorSelecionado) => {
          if (valorSelecionado) onValorChange(valorSelecionado)
        }}
      >
        <SelectTrigger
          id={id}
          className="h-10! w-full rounded-sm border-input-border-muted"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}
