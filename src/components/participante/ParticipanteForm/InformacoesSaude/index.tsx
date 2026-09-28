import type { Control, UseFormSetValue } from 'react-hook-form'
import { AnexoDocumentos } from '../AnexoDocumentos'
import { PERGUNTAS_SAUDE } from '../constantes'
import { PerguntaSaude } from '../PerguntaSaude'
import type { FormValues } from '../schema'

type InformacoesSaudeProps = {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
}

export function InformacoesSaude({
  control,
  setValue,
}: Readonly<InformacoesSaudeProps>) {
  return (
    <div className="flex flex-col gap-5.5">
      {PERGUNTAS_SAUDE.map((pergunta) => (
        <PerguntaSaude
          key={pergunta.name}
          control={control}
          setValue={setValue}
          pergunta={pergunta}
        />
      ))}
      <AnexoDocumentos />
    </div>
  )
}
