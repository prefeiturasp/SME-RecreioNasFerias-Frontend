import type { Control } from 'react-hook-form'
import {
  OPCOES_GRUPO_PARTICIPANTE,
  OPCOES_SIM_NAO,
  OPCOES_TIPO_ESCOLA,
} from '../constantes'
import type { FormValues } from '../schema'

import { FormField } from '@/components/ui/form-field'
import { FormFieldLeitura } from '@/components/ui/form-field-leitura'

type InformacoesPorGrupoProps = {
  control: Control<FormValues>
  idade: string
}

export function InformacoesPorGrupo({
  control,
  idade,
}: Readonly<InformacoesPorGrupoProps>) {
  return (
    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
      <FormFieldLeitura
        id="idade"
        label={
          <>
            <span className="text-destructive">*</span> Idade
          </>
        }
        value={idade}
      />
      <FormField
        control={control}
        name="grupoParticipante"
        label={
          <>
            <span className="text-destructive">*</span> Grupo do Participante
          </>
        }
        type="select"
        options={OPCOES_GRUPO_PARTICIPANTE}
        placeholder="Selecione o grupo"
      />
      <FormField
        control={control}
        name="estaNaRede"
        label={
          <>
            <span className="text-destructive">*</span> É aluno da Rede
            Municipal?
          </>
        }
        type="radio"
        options={OPCOES_SIM_NAO}
      />
      <FormField
        control={control}
        name="tipoEscola"
        label={
          <>
            <span className="text-destructive">*</span> Tipo de escola
          </>
        }
        type="radio"
        options={OPCOES_TIPO_ESCOLA}
      />
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
      />
      <FormField
        control={control}
        name="turmaAno"
        label={
          <>
            <span className="text-destructive">*</span> Turma / Ano
          </>
        }
        readOnly
      />
      <FormField
        control={control}
        name="podeIrSozinho"
        label={
          <>
            <span className="text-destructive">*</span> Pode ir embora sozinho?
          </>
        }
        type="radio"
        options={OPCOES_SIM_NAO}
      />
      <FormField
        control={control}
        name="responsavelRetirada"
        label={
          <>
            <span className="text-destructive">*</span> Responsável por retirar
            na saída
          </>
        }
      />
      <FormField
        control={control}
        name="autorizaPiscina"
        label={
          <>
            <span className="text-destructive">*</span> Autoriza uso da
            piscina?
          </>
        }
        type="radio"
        options={OPCOES_SIM_NAO}
      />
    </div>
  )
}
