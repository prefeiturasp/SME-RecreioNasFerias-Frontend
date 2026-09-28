import { useEffect } from 'react'
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { OPCOES_SIM_NAO, PERGUNTAS_SAUDE, RESPOSTA_SIM } from '../constantes'
import type { FormValues } from '../schema'

import { FormField } from '@/components/ui/form-field'

type PerguntaSaudeItem = (typeof PERGUNTAS_SAUDE)[number]

type PerguntaSaudeProps = {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
  pergunta: PerguntaSaudeItem
}

export function PerguntaSaude({
  control,
  setValue,
  pergunta,
}: Readonly<PerguntaSaudeProps>) {
  const resposta = useWatch({ control, name: pergunta.name })
  const qualLiberado = resposta === RESPOSTA_SIM

  useEffect(() => {
    if (qualLiberado) return

    setValue(pergunta.nameQual, '')
  }, [qualLiberado, pergunta.nameQual, setValue])

  return (
    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
      <FormField
        control={control}
        name={pergunta.name}
        label={
          <>
            <span className="text-destructive">*</span> {pergunta.pergunta}
          </>
        }
        type="radio"
        options={OPCOES_SIM_NAO}
      />
      {pergunta.tipoQual === 'select' ? (
        <FormField
          control={control}
          name={pergunta.nameQual}
          label={
            <>
              <span className="text-destructive">*</span> Qual?
            </>
          }
          type="select"
          options={[...pergunta.opcoes]}
          placeholder="Selecione"
          disabled={!qualLiberado}
          triggerClassName={
            qualLiberado
              ? undefined
              : 'cursor-not-allowed bg-input-disabled-bg text-placeholder opacity-100'
          }
        />
      ) : (
        <FormField
          control={control}
          name={pergunta.nameQual}
          label={
            <>
              <span className="text-destructive">*</span> Qual?
            </>
          }
          readOnly={!qualLiberado}
        />
      )}
    </div>
  )
}
