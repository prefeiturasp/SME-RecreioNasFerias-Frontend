import { FormFieldEol } from '@/components/ui/form-field-eol'
import type { FormValues } from '../../schema'
import { aplicarMascaraCpf } from '@/utils/mascarasEntrada'
import type { Control } from 'react-hook-form'

type InformacoesBasicasEstudanteRedeProps = {
  control: Control<FormValues>
  eolDesabilitado?: boolean
  consultandoCodigoEol?: boolean
  onBuscarCodigoEol?: (codigoEol: string) => void
  aoMudarCodigoEol?: (codigoEol: string) => void
  cpfDesabilitado?: boolean
  consultandoCpf?: boolean
  onBuscarCpf?: (cpf: string) => void
  aoMudarCpf?: (cpf: string) => void
}

export const InformacoesBasicasEstudanteRede = ({
  control,
  eolDesabilitado = false,
  consultandoCodigoEol = false,
  onBuscarCodigoEol,
  aoMudarCodigoEol,
  cpfDesabilitado = false,
  consultandoCpf = false,
  onBuscarCpf,
  aoMudarCpf,
}: Readonly<InformacoesBasicasEstudanteRedeProps>) => {
  return (
    <>
      <FormFieldEol
        control={control}
        name="codigoEol"
        label={
          <>
            <span className="text-destructive">*</span> Consultar por código EOL
          </>
        }
        placeholder="Código EOL"
        buscarAoSair
        readOnly={eolDesabilitado}
        isLoading={consultandoCodigoEol}
        onSearch={onBuscarCodigoEol}
        onChange={aoMudarCodigoEol}
      />
      <FormFieldEol
        control={control}
        name="cpf"
        label={
          <>
            <span className="text-destructive">*</span> Consultar por CPF do
            responsável
          </>
        }
        placeholder="Digite o CPF"
        buscarAoSair
        readOnly={cpfDesabilitado}
        maxLength={11}
        maxLengthExibicao={14}
        rotuloBusca="CPF do responsável"
        formatarExibicao={aplicarMascaraCpf}
        isLoading={consultandoCpf}
        onSearch={onBuscarCpf}
        onChange={aoMudarCpf}
      />
    </>
  )
}
