import { FormFieldEol } from '@/components/ui/form-field-eol'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useGetDuplicidadeCPFInscricaoExterna } from '@/hooks/useGetDuplicidadeCPFInscricaoExterna'
import { aplicarMascaraCpf, aplicarMascaraData } from '@/utils/mascarasEntrada'
import { calcularIdadeDetalhada } from '@/utils/calcularIdadeDetalhada'
import { useEffect } from 'react'
import {
  Controller,
  useWatch,
  type Control,
  type UseFormSetValue,
} from 'react-hook-form'
import { formatarDataBr } from '@/lib/formatarPeriodo'
import {
  IDADE_MINIMA_INVALIDA,
  MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
  MENSAGEM_IDADE_FORA_DA_FAIXA,
} from '../../constantes'
import { useToast } from '@/hooks/useToast'
import type { FormValues } from '../../schema'

type InformacoesBasicasEstudanteExternoProps = {
  control: Control<FormValues>
}

type CPFParticipanteEstudanteExternoProps =
  InformacoesBasicasEstudanteExternoProps & {
    setValue: UseFormSetValue<FormValues>
    somenteLeitura?: boolean
  }

export const CPFParticipanteEstudanteExterno = ({
  control,
  setValue,
  somenteLeitura = false,
}: Readonly<CPFParticipanteEstudanteExternoProps>) => {
  const cpf = useWatch({ control, name: 'cpf_participante' })
  const consultaDuplicidade = useGetDuplicidadeCPFInscricaoExterna(
    cpf,
    !somenteLeitura,
  )
  const { dismissToast, showToast } = useToast()

  useEffect(() => {
    if (somenteLeitura || !consultaDuplicidade.data) return

    const possuiInscricao = consultaDuplicidade.data.possui_inscricao === true
    setValue('possuiInscricaoCpfParticipante', possuiInscricao, {
      shouldValidate: false,
    })

    if (possuiInscricao) {
      showToast({
        id: 'duplicidade-cpf-participante',
        title: 'Inscrição existente',
        description: MENSAGEM_DUPLICIDADE_CPF_PARTICIPANTE,
        variant: 'destructive',
      })
    }
  }, [consultaDuplicidade.data, setValue, showToast, somenteLeitura])

  return (
    <FormFieldEol
      control={control}
      name="cpf_participante"
      readOnly={somenteLeitura}
      onChange={() => {
        setValue('possuiInscricaoCpfParticipante', false, {
          shouldValidate: false,
        })
        dismissToast('duplicidade-cpf-participante')
      }}
      label={
        <>
          <span className="text-destructive">*</span> CPF do(a) participante
        </>
      }
      placeholder="Digite o CPF do(a) participante"
      maxLength={11}
      maxLengthExibicao={14}
      formatarExibicao={aplicarMascaraCpf}
    />
  )
}

export const DataNascimentoEstudanteExterno = ({
  control,
}: Readonly<InformacoesBasicasEstudanteExternoProps>) => {
  const { dismissToast, showToast } = useToast()

  return (
    <Controller
      control={control}
      name="dataNascimento"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            id="dataNascimento-rotulo"
            htmlFor="dataNascimento"
            className="font-bold"
          >
            <span className="text-destructive">*</span> Data de nascimento do(a)
            participante
          </FieldLabel>
          <Input
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            id="dataNascimento"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="DD/MM/AAAA"
            className="h-10 rounded-sm border-input-border-muted"
            value={paraExibicao(field.value)}
            onChange={(evento) => {
              const valor = paraValorDoFormulario(evento.target.value)
              field.onChange(valor)

              const idade = calcularIdadeDetalhada(valor)
              if (idade && idade.anos >= IDADE_MINIMA_INVALIDA) {
                showToast({
                  id: 'idade-fora-da-faixa',
                  variant: 'destructive',
                  description: MENSAGEM_IDADE_FORA_DA_FAIXA,
                })
              } else {
                dismissToast('idade-fora-da-faixa')
              }
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

// O formulário guarda AAAA-MM-DD quando a data está completa e válida;
// enquanto o usuário digita, guarda o texto mascarado parcial.
function paraExibicao(valor: string): string {
  return /^\d{4}-\d{2}-\d{2}/.test(valor) ? formatarDataBr(valor) : valor
}

function paraValorDoFormulario(texto: string): string {
  const mascarado = aplicarMascaraData(texto)
  if (mascarado.length < 10) return mascarado

  const [dia, mes, ano] = mascarado.split('/').map(Number)
  const data = new Date(ano, mes - 1, dia)
  const valida =
    ano >= 1000 &&
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  if (!valida) return mascarado

  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

export const CPFResponsavelEstudanteExterno = ({
  control,
}: Readonly<InformacoesBasicasEstudanteExternoProps>) => (
  <FormFieldEol
    control={control}
    name="cpf"
    label={
      <>
        <span className="text-destructive">*</span> CPF do(a) responsável
      </>
    }
    placeholder="Digite o CPF do(a) responsável"
    maxLength={11}
    maxLengthExibicao={14}
    formatarExibicao={aplicarMascaraCpf}
  />
)
