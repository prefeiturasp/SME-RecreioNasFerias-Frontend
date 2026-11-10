import { useMemo } from 'react'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import type { FormValues } from '../schema'
import { FormField } from '@/components/ui/form-field'
import type { Dre } from '@/services/dre/types'
import type { OpcaoChoice, PoloElegivel } from '@/services/inscricao/types'
import { TIPO_ESTUDANTE_EXTERNO, TIPO_ESTUDANTE_REDE } from '../constantes'
import { InformacoesBasicasEstudanteRede } from './InformacoesBasicasEstudanteRede'
import {
  CPFParticipanteEstudanteExterno,
  CPFResponsavelEstudanteExterno,
  DataNascimentoEstudanteExterno,
} from './InformacoesBasicasEstudanteExterno'
import { formatarDataBr } from '@/lib/formatarPeriodo'

type InformacoesBasicasProps = {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
  grupo: string
  tipoTravado: boolean
  camposLiberados: boolean
  tipoEstudante: string
  dreCodigoEol: string
  dres: Dre[]
  polos: PoloElegivel[]
  tiposEstudante: OpcaoChoice[]
  grupos: OpcaoChoice[]
  erro?: unknown
  consultandoCodigoEol?: boolean
  consultandoCpf?: boolean
  onBuscarCodigoEol?: (codigoEol: string) => void
  aoMudarCodigoEol?: (codigoEol: string) => void
  onBuscarCpf?: (cpf: string) => void
  aoMudarCpf?: (cpf: string) => void
  eolDesabilitado?: boolean
  cpfDesabilitado?: boolean
  aoMudarGrupo?: (valor: string) => void
  aoMudarTipoEstudante?: (valor: string) => void
  aoMudarDre?: (valor: string) => void
}

type CampoTipoEstudanteProps = {
  control: Control<FormValues>
  tipoTravado: boolean
  rotulo: string
  opcoes: OpcaoChoice[]
  onChange?: (valor: string) => void
}

function CampoTipoEstudante({
  control,
  tipoTravado,
  rotulo,
  opcoes,
  onChange,
}: Readonly<CampoTipoEstudanteProps>) {
  const label = (
    <>
      <span className="text-destructive">*</span> Tipo de estudante
    </>
  )

  if (tipoTravado) {
    return (
      <FormField
        control={control}
        name="tipoEstudante"
        label={label}
        readOnly
        valorExibicao={rotulo}
      />
    )
  }

  return (
    <FormField
      control={control}
      name="tipoEstudante"
      label={label}
      type="select"
      options={opcoes}
      placeholder="Selecione o tipo de estudante"
      onChange={onChange}
    />
  )
}

type CamposNascimentoECpfProps = {
  control: Control<FormValues>
  tipoEstudante: string
  dataNascimento: string
}

function CamposNascimentoECpf({
  control,
  tipoEstudante,
  dataNascimento,
}: Readonly<CamposNascimentoECpfProps>) {
  if (tipoEstudante === TIPO_ESTUDANTE_REDE) {
    return (
      <FormField
        control={control}
        name="dataNascimento"
        label={
          <>
            <span className="text-destructive">*</span> Data de nascimento
            do(a) participante
          </>
        }
        placeholder="DD/MM/AAAA"
        valorExibicao={formatarDataBr(dataNascimento)}
        readOnly
      />
    )
  }

  if (tipoEstudante === TIPO_ESTUDANTE_EXTERNO) {
    return (
      <>
        <div className="lg:col-start-1">
          <DataNascimentoEstudanteExterno control={control} />
        </div>
        <br />
        <CPFResponsavelEstudanteExterno control={control} />
      </>
    )
  }

  return null
}

export function InformacoesBasicas({
  control,
  setValue,
  grupo,
  tipoTravado,
  camposLiberados,
  tipoEstudante,
  dreCodigoEol,
  dres,
  polos,
  tiposEstudante,
  grupos,
  consultandoCodigoEol = false,
  consultandoCpf = false,
  onBuscarCodigoEol,
  aoMudarCodigoEol,
  onBuscarCpf,
  aoMudarCpf,
  aoMudarGrupo,
  aoMudarTipoEstudante,
  aoMudarDre,
  eolDesabilitado = false,
  cpfDesabilitado = false,
}: Readonly<InformacoesBasicasProps>) {
  const rotuloTipoEstudante = useMemo(
    () =>
      tiposEstudante.find((opcao) => opcao.value === tipoEstudante)?.label ??
      '',
    [tipoEstudante, tiposEstudante],
  )
  const dataNascimento = useWatch({ control, name: 'dataNascimento' })

  return (
    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
      <FormField
        control={control}
        name="grupo"
        label={
          <>
            <span className="text-destructive">*</span> Agrupamento
          </>
        }
        type="select"
        options={grupos}
        placeholder="Selecione o Agrupamento"
        onChange={aoMudarGrupo}
      />
      {grupo ? (
        <CampoTipoEstudante
          control={control}
          tipoTravado={tipoTravado}
          rotulo={rotuloTipoEstudante}
          opcoes={tiposEstudante}
          onChange={aoMudarTipoEstudante}
        />
      ) : null}
      {camposLiberados ? (
        <>
          {tipoEstudante === TIPO_ESTUDANTE_REDE ? (
            <InformacoesBasicasEstudanteRede
              control={control}
              eolDesabilitado={eolDesabilitado}
              consultandoCodigoEol={consultandoCodigoEol}
              onBuscarCodigoEol={onBuscarCodigoEol}
              aoMudarCodigoEol={aoMudarCodigoEol}
              cpfDesabilitado={cpfDesabilitado}
              consultandoCpf={consultandoCpf}
              onBuscarCpf={onBuscarCpf}
              aoMudarCpf={aoMudarCpf}
            />
          ) : (
            <CPFParticipanteEstudanteExterno
              control={control}
              setValue={setValue}
            />
          )}

          <FormField
            control={control}
            name="nomeCompleto"
            label={
              <>
                <span className="text-destructive">*</span> Nome completo do(a)
                participante
              </>
            }
            placeholder="Nome completo do(a) participante"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <CamposNascimentoECpf
            control={control}
            tipoEstudante={tipoEstudante}
            dataNascimento={dataNascimento}
          />
          <FormField
            control={control}
            name="nomeResponsavel"
            label={
              <>
                <span className="text-destructive">*</span> Nome completo do(a)
                responsável
              </>
            }
            placeholder="Nome Completo do(a) responsável"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="nomeSocialResponsavel"
            label="Nome social do(a) responsável"
            placeholder="Nome Social do(a) Responsável"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          {tipoEstudante === TIPO_ESTUDANTE_EXTERNO ? <br /> : null}
          <FormField
            control={control}
            name="cep"
            label={
              <>
                <span className="text-destructive">*</span> CEP
              </>
            }
            placeholder="CEP"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="logradouro"
            label={
              <>
                <span className="text-destructive">*</span> Logradouro
              </>
            }
            placeholder="Logradouro"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="numero"
            label={
              <>
                <span className="text-destructive">*</span> Número
              </>
            }
            placeholder="Número"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="complemento"
            label="Complemento"
            placeholder="Complemento"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="bairro"
            label={
              <>
                <span className="text-destructive">*</span> Bairro
              </>
            }
            placeholder="Bairro"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="cidade"
            label={
              <>
                <span className="text-destructive">*</span> Cidade
              </>
            }
            placeholder="Cidade"
            readOnly={tipoEstudante === TIPO_ESTUDANTE_REDE}
          />
          <FormField
            control={control}
            name="telefone1"
            label={
              <>
                <span className="text-destructive">*</span> Telefone de
                contato/emergência 1
              </>
            }
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
          />
          <FormField
            control={control}
            name="telefone2"
            label="Telefone de contato/emergência 2"
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
          />
          <FormField
            control={control}
            name="email"
            label={
              <>
                <span className="text-destructive">*</span> E-mail
              </>
            }
            type="email"
            placeholder="Informe o e-mail"
          />
          <FormField
            control={control}
            name="dreCodigoEol"
            label={
              <>
                <span className="text-destructive">*</span> DRE
              </>
            }
            type="select"
            options={dres.map((dre) => ({
              value: dre.codigo_dre,
              label: dre.nome_dre,
            }))}
            placeholder="Selecione a DRE"
            onChange={aoMudarDre}
          />
          <FormField
            control={control}
            name="polo"
            label={
              <>
                <span className="text-destructive">*</span> Polo de Inscrição
              </>
            }
            type="select"
            disabled={!dreCodigoEol}
            options={polos.map((polo) => ({
              value: polo.uuid,
              label: polo.nome_polo,
            }))}
            placeholder={
              dreCodigoEol
                ? 'Selecione o Polo'
                : 'É necessário selecionar o DRE primeiro'
            }
          />
        </>
      ) : null}
    </div>
  )
}
