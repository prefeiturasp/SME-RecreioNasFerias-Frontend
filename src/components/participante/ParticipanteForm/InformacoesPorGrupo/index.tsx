import { useMemo } from 'react'
import { useWatch, type Control } from 'react-hook-form'
import type { FormValues } from '../schema'

import { FormField } from '@/components/ui/form-field'
import { FormFieldLeitura } from '@/components/ui/form-field-leitura'
import { Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { OpcaoChoice } from '@/services/inscricao/types'
import { calcularIdadeCheia } from '@/utils/calcularIdadeCheia'

type InformacoesPorGrupoProps = {
  control: Control<FormValues>
  grupos: OpcaoChoice[]
}

export function InformacoesPorGrupo({
  control,
  grupos,
}: Readonly<InformacoesPorGrupoProps>) {
  const [dataNascimento, nomeTurma, ano] = useWatch({
    control,
    name: ['dataNascimento', 'nomeTurma', 'ano'],
  })
  const textoIdade = useMemo(() => {
    const idade = calcularIdadeCheia(dataNascimento)
    if (idade === null) return ''
    return idade === 1 ? '1 ano' : `${idade} anos`
  }, [dataNascimento])
  const turmaAno = useMemo(
    () => [nomeTurma, ano].filter((parte) => parte.trim()).join(' / '),
    [nomeTurma, ano],
  )

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormFieldLeitura
          id="idade"
          label={
            <>
              <span className="text-destructive">*</span> Idade
            </>
          }
          value={textoIdade}
        />
        <FormField
          control={control}
          name="grupo"
          id="grupoDoParticipante"
          label={
            <>
              <span className="text-destructive">*</span> Grupo do Participante
            </>
          }
          type="select"
          options={grupos}
          disabled
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel id="alunoRedeMunicipal-rotulo" className="font-bold">
            <span className="text-destructive">*</span> É aluno da Rede
            Municipal?
          </FieldLabel>
          <RadioGroup
            aria-labelledby="alunoRedeMunicipal-rotulo"
            value="sim"
            disabled
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="sim" id="alunoRedeMunicipal-sim" />
              <FieldLabel
                htmlFor="alunoRedeMunicipal-sim"
                className="font-normal"
              >
                Sim
              </FieldLabel>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="nao" id="alunoRedeMunicipal-nao" />
              <FieldLabel
                htmlFor="alunoRedeMunicipal-nao"
                className="font-normal"
              >
                Não
              </FieldLabel>
            </div>
          </RadioGroup>
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="unidadeEducacional"
          label={
            <>
              <span className="text-destructive">*</span> Unidade Educacional do
              participante
            </>
          }
          readOnly
          placeholder="Unidade Educacional"
        />
        <FormFieldLeitura
          id="turmaAno"
          label={
            <>
              <span className="text-destructive">*</span> Turma / Ano
            </>
          }
          value={turmaAno}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="podeIrEmboraSozinho"
          label={
            <>
              <span className="text-destructive">*</span> Pode ir embora
              sozinho?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
        />
        <FormField
          control={control}
          name="responsavelRetirada"
          label={
            <>
              <span className="text-destructive">*</span> Responsável por
              retirar na saída
            </>
          }
          placeholder="Informe o responsável por retirar na saída"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="autorizaUsoPiscina"
          label={
            <>
              <span className="text-destructive">*</span> Autoriza uso da
              piscina?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
        />
      </div>
    </>
  )
}
