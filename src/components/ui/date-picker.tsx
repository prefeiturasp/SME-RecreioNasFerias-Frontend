import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { ptBR } from 'react-day-picker/locale'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  id?: string
  value: string
  placeholder?: string
  className?: string
  'aria-label'?: string
  'aria-invalid'?: boolean
  onChange: (iso: string) => void
  onBlur?: () => void
}

function DatePicker({
  id,
  value,
  placeholder = 'Selecione a data',
  className,
  onChange,
  onBlur,
  ...props
}: Readonly<DatePickerProps>) {
  const [aberto, setAberto] = useState(false)
  const selecionada = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined

  return (
    <Popover
      open={aberto}
      onOpenChange={(abertoAgora) => {
        setAberto(abertoAgora)
        if (!abertoAgora) {
          onBlur?.()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={!selecionada}
          aria-label={props['aria-label']}
          aria-invalid={props['aria-invalid']}
          className={cn(
            'w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">
            {selecionada ? format(selecionada, 'dd/MM/yyyy') : placeholder}
          </span>
          <CalendarIcon className="size-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selecionada}
          defaultMonth={selecionada}
          onSelect={(data) => {
            onChange(data ? format(data, 'yyyy-MM-dd') : '')
            setAberto(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
