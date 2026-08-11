import { IconeCalendario } from '@/components/icons'
import { cn } from '@/lib/utils'

const classesCampoData = cn(
  'relative h-[var(--size-input-height)] w-full rounded-[var(--size-radius-sm)] border border-[var(--color-input-border-muted)] bg-[var(--color-background)]',
  'pr-9 pl-2 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal text-[var(--color-text)]',
  'transition-[var(--transition-input)]',
  'focus:border-[var(--color-brand-dark)] focus:outline-2 focus:outline-[var(--color-brand-dark)] focus:outline-offset-0',
  'focus-visible:border-[var(--color-brand-dark)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-dark)] focus-visible:outline-offset-0',
  '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:opacity-0',
  'invalid:[&::-webkit-datetime-edit]:invisible focus:[&::-webkit-datetime-edit]:visible valid:[&::-webkit-datetime-edit]:visible',
)

type CampoDataFormularioProps = {
  id: string
  name: string
  rotuloAcessivel: string
  placeholder: 'De' | 'Até'
  valor?: string
}

export function CampoDataFormulario({
  id,
  name,
  rotuloAcessivel,
  placeholder,
  valor,
}: Readonly<CampoDataFormularioProps>) {
  return (
    <div className="group relative flex min-w-0 items-center">
      <input
        type="date"
        id={id}
        name={name}
        required
        aria-label={rotuloAcessivel}
        defaultValue={valor}
        className={classesCampoData}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-1/2 left-2 -translate-y-1/2',
          'font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-normal text-[var(--color-placeholder)]',
          'group-focus-within:opacity-0 group-has-[input:valid]:hidden',
        )}
      >
        {placeholder}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 inline-flex size-5 -translate-y-1/2 items-center justify-center text-[var(--color-brand-dark)] [&>svg]:block [&>svg]:size-5"
      >
        <IconeCalendario />
      </span>
    </div>
  )
}

type GrupoPeriodoDataProps = {
  rotulo: string
  idCampoInicio: string
  nomeCampoInicio: string
  rotuloAcessivelInicio: string
  idCampoFim: string
  nomeCampoFim: string
  rotuloAcessivelFim: string
  valorCampoInicio?: string
  valorCampoFim?: string
}

export function GrupoPeriodoData({
  rotulo,
  idCampoInicio,
  nomeCampoInicio,
  rotuloAcessivelInicio,
  idCampoFim,
  nomeCampoFim,
  rotuloAcessivelFim,
  valorCampoInicio,
  valorCampoFim,
}: Readonly<GrupoPeriodoDataProps>) {
  return (
    <div className="flex min-w-0 flex-col">
      <label
        htmlFor={idCampoInicio}
        className="mb-1 font-[family-name:var(--font-family)] text-[length:var(--font-size-label)] font-bold text-[var(--color-text)]"
      >
        {rotulo}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <CampoDataFormulario
          id={idCampoInicio}
          name={nomeCampoInicio}
          rotuloAcessivel={rotuloAcessivelInicio}
          placeholder="De"
          valor={valorCampoInicio}
        />
        <CampoDataFormulario
          id={idCampoFim}
          name={nomeCampoFim}
          rotuloAcessivel={rotuloAcessivelFim}
          placeholder="Até"
          valor={valorCampoFim}
        />
      </div>
    </div>
  )
}
