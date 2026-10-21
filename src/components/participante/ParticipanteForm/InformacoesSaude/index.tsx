import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import type { FormValues } from '../schema'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { useMemo } from 'react'

import { FormField } from '@/components/ui/form-field'
import { FormFieldMultiSelect } from '@/components/ui/form-field-multi-select'

type InformacoesSaudeProps = {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
}

export function InformacoesSaude({
  control,
  setValue,
}: Readonly<InformacoesSaudeProps>) {
  const criancaComDeficiencia = useWatch({
    control,
    name: 'criancaComDeficiencia',
  })
  const qualDeficiencia = useWatch({ control, name: 'qualDeficiencia' })
  const criancaComProblemaSaude = useWatch({
    control,
    name: 'criancaComProblemaSaude',
  })
  const qualProblemaSaude = useWatch({ control, name: 'qualProblemaSaude' })
  const medicacaoTratamentoContinuo = useWatch({
    control,
    name: 'medicacaoTratamentoContinuo',
  })
  const restricaoMedicamentoProntoAtendimento = useWatch({
    control,
    name: 'restricaoMedicamentoProntoAtendimento',
  })
  const temConvenioMedico = useWatch({
    control,
    name: 'temConvenioMedico',
  })

  const choicesQuery = useGetValoresChoices()
  const deficiencias = useMemo(
    () => choicesQuery.data?.deficiencias ?? [],
    [choicesQuery.data?.deficiencias],
  )
  const problemasSaude = useMemo(
    () => choicesQuery.data?.problemas_saude ?? [],
    [choicesQuery.data?.problemas_saude],
  )
  const mostrarOutraDeficiencia = qualDeficiencia.some((opcao) =>
    ['outro', 'outra'].includes(opcao.label.trim().toLocaleLowerCase('pt-BR')),
  )
  const mostrarOutroProblemaSaude = qualProblemaSaude.some((opcao) =>
    ['outro', 'outra'].includes(opcao.label.trim().toLocaleLowerCase('pt-BR')),
  )

  function aoMudarDeficiencia(valor: string) {
    if (valor !== 'nao') return
    setValue('qualDeficiencia', [])
    setValue('outraDeficiencia', '')
  }

  function aoMudarDeficiencias(
    opcoes: Array<{ value: string; label: string }>,
  ) {
    const outraSelecionada = opcoes.some((opcao) =>
      ['outro', 'outra'].includes(
        opcao.label.trim().toLocaleLowerCase('pt-BR'),
      ),
    )
    if (!outraSelecionada) setValue('outraDeficiencia', '')
  }

  function aoMudarProblemaSaude(
    opcoes: Array<{ value: string; label: string }>,
  ) {
    const outraSelecionada = opcoes.some((opcao) =>
      ['outro', 'outra'].includes(
        opcao.label.trim().toLocaleLowerCase('pt-BR'),
      ),
    )
    if (!outraSelecionada) setValue('outroProblemaSaude', '')
  }

  function existeProblemaSaude(valor: string) {
    if (valor !== 'nao') return
    setValue('qualProblemaSaude', [])
    setValue('outroProblemaSaude', '')
  }

  function aoMudarMedicacao(valor: string) {
    if (valor !== 'nao') return
    setValue('qualMedicacaoTratamentoContinuo', '')
  }

  function aoMudarRestricaoMedicamento(valor: string) {
    if (valor !== 'nao') return
    setValue('qualRestricaoMedicamentoProntoAtendimento', '')
  }

  function aoMudarConvenio(valor: string) {
    if (valor !== 'nao') return
    setValue('qualConvenioMedico', '')
  }

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="criancaComDeficiencia"
          label={
            <>
              <span className="text-destructive">*</span> Criança com
              deficiência?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          onChange={aoMudarDeficiencia}
        />
        <div className="flex flex-col gap-4">
          <FormFieldMultiSelect
            control={control}
            name="qualDeficiencia"
            label={
              <>
                {criancaComDeficiencia === 'sim' && (
                  <span className="text-destructive">*</span>
                )}
                Qual? (pode escolher mais de uma opção)
              </>
            }
            disabled={criancaComDeficiencia !== 'sim'}
            options={deficiencias}
            placeholder="Selecione as deficiências"
            onChange={aoMudarDeficiencias}
          />
          {mostrarOutraDeficiencia ? (
            <FormField
              control={control}
              name="outraDeficiencia"
              label="Qual ou quais outros tipos de deficiência?"
              placeholder="Descreva a(s) deficiência(s)"
              type="textarea"
              rows={1}
              autoResize
              maxLength={300}
              textareaClassName="min-h-10 rounded-sm border-input-border-muted"
            />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 mt-4">
        <FormField
          control={control}
          name="criancaComProblemaSaude"
          label={
            <>
              <span className="text-destructive">*</span> Criança com problema
              de saúde?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          onChange={existeProblemaSaude}
        />

        <div className="flex flex-col gap-4">
          <FormFieldMultiSelect
            control={control}
            name="qualProblemaSaude"
            label={
              <>
                {criancaComProblemaSaude === 'sim' && (
                  <span className="text-destructive">*</span>
                )}
                Qual? (pode escolher mais de uma opção)
              </>
            }
            disabled={criancaComProblemaSaude !== 'sim'}
            options={problemasSaude}
            placeholder="Selecione o(s) problema(s) de saúde"
            onChange={aoMudarProblemaSaude}
          />
          {mostrarOutroProblemaSaude ? (
            <FormField
              control={control}
              name="outroProblemaSaude"
              label="Qual ou quais outros problemas de saúde?"
              placeholder="Descreva o(s) problema(s) de saúde"
              type="textarea"
              rows={1}
              autoResize
              maxLength={300}
              textareaClassName="min-h-10 rounded-sm border-input-border-muted"
            />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 mt-4">
        <FormField
          control={control}
          name="medicacaoTratamentoContinuo"
          label={
            <>
              <span className="text-destructive">*</span> Medicação/tratamento
              contínuo?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          onChange={aoMudarMedicacao}
        />
        <FormField
          control={control}
          name="qualMedicacaoTratamentoContinuo"
          label={
            <>
              {medicacaoTratamentoContinuo === 'sim' && (
                <span className="text-destructive">*</span>
              )}
              Qual?
            </>
          }
          type="textarea"
          rows={1}
          autoResize
          maxLength={300}
          textareaClassName="min-h-10 rounded-sm border-input-border-muted"
          readOnly={medicacaoTratamentoContinuo !== 'sim'}
          placeholder="Informe a medicação/tratamento contínuo"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 mt-4">
        <FormField
          control={control}
          name="restricaoMedicamentoProntoAtendimento"
          label={
            <>
              <span className="text-destructive">*</span> Restrição a
              medicamento em pronto atendimento?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          onChange={aoMudarRestricaoMedicamento}
        />
        <FormField
          control={control}
          name="qualRestricaoMedicamentoProntoAtendimento"
          label={
            <>
              {restricaoMedicamentoProntoAtendimento === 'sim' && (
                <span className="text-destructive">*</span>
              )}
              Qual?
            </>
          }
          type="textarea"
          rows={1}
          autoResize
          maxLength={300}
          textareaClassName="min-h-10 rounded-sm border-input-border-muted"
          readOnly={restricaoMedicamentoProntoAtendimento !== 'sim'}
          placeholder="Informe a restrição a medicamento em pronto atendimento"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 mt-4">
        <FormField
          control={control}
          name="temConvenioMedico"
          label={
            <>
              <span className="text-destructive">*</span> Tem convênio médico?
            </>
          }
          type="radio"
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          onChange={aoMudarConvenio}
        />
        <FormField
          control={control}
          name="qualConvenioMedico"
          label={
            <>
              {temConvenioMedico === 'sim' && (
                <span className="text-destructive">*</span>
              )}
              Qual?
            </>
          }
          type="text"
          readOnly={temConvenioMedico !== 'sim'}
          placeholder="Informe o convênio médico"
        />
      </div>
    </>
  )
}
