import { useMemo } from 'react'
import type { Control } from 'react-hook-form'
import type { FormValues } from '../schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { FormField } from '@/components/ui/form-field'
import { FormFieldEol } from '@/components/ui/form-field-eol'
import type { Dre } from '@/services/dre/types'
import type { OpcaoChoice, PoloElegivel } from '@/services/inscricao/types'

type InformacoesBasicasProps = {
  control: Control<FormValues>
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
  onBuscarCodigoEol?: (codigoEol: string) => void
  aoMudarCodigoEol?: (codigoEol: string) => void
  onBuscarCpf?: (cpf: string) => void
  aoMudarGrupo?: (valor: string) => void
  aoMudarDre?: (valor: string) => void
}

export function InformacoesBasicas({
  control,
  grupo,
  tipoTravado,
  camposLiberados,
  tipoEstudante,
  dreCodigoEol,
  dres,
  polos,
  tiposEstudante,
  grupos,
  erro,
  consultandoCodigoEol = false,
  onBuscarCodigoEol,
  aoMudarCodigoEol,
  onBuscarCpf,
  aoMudarGrupo,
  aoMudarDre,
}: Readonly<InformacoesBasicasProps>) {
  const rotuloTipoEstudante = useMemo(
    () =>
      tiposEstudante.find((opcao) => opcao.value === tipoEstudante)?.label ??
      '',
    [tipoEstudante, tiposEstudante],
  )

  return (
    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
      <AlertaErroApi erro={erro} className="lg:col-span-2" />
      <FormField
        control={control}
        name="grupo"
        label={
          <>
            <span className="text-destructive">*</span> Grupo
          </>
        }
        type="select"
        options={grupos}
        placeholder="Selecione o grupo"
        onChange={aoMudarGrupo}
      />
      {grupo && tipoTravado ? (
        <FormField
          control={control}
          name="tipoEstudante"
          label={
            <>
              <span className="text-destructive">*</span> Tipo de estudante
            </>
          }
          readOnly
          valorExibicao={rotuloTipoEstudante}
        />
      ) : null}
      {grupo && !tipoTravado ? (
        <FormField
          control={control}
          name="tipoEstudante"
          label={
            <>
              <span className="text-destructive">*</span> Tipo de estudante
            </>
          }
          type="select"
          options={tiposEstudante}
          placeholder="Selecione o tipo de estudante"
        />
      ) : null}
      {camposLiberados ? (
        <>
          <FormFieldEol
            control={control}
            name="codigoEol"
            label={
              <>
                <span className="text-destructive">*</span> Código EOL
              </>
            }
            placeholder="Código EOL"
            buscaInterna
            isLoading={consultandoCodigoEol}
            onSearch={onBuscarCodigoEol}
            onChange={aoMudarCodigoEol}
          />
          <FormFieldEol
            control={control}
            name="cpf"
            label={
              <>
                <span className="text-destructive">*</span> CPF
              </>
            }
            placeholder="Digite o CPF"
            buscaInterna
            maxLength={11}
            rotuloBusca="CPF"
            onSearch={onBuscarCpf}
          />
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
            readOnly
          />
          <FormField
            control={control}
            name="dataNascimento"
            label={
              <>
                <span className="text-destructive">*</span> Data de nascimento
              </>
            }
            placeholder="DD/MM/AAAA"
            readOnly
          />
          <FormField
            control={control}
            name="nomeResponsavel"
            label={
              <>
                <span className="text-destructive">*</span> Nome completo do
                responsável
              </>
            }
            placeholder="Nome Completo do Responsável"
            readOnly
          />
          <FormField
            control={control}
            name="nomeSocialResponsavel"
            label="Nome social do(a) responsável"
            placeholder="Nome Social do(a) Responsável"
            readOnly
          />
          <FormField
            control={control}
            name="cep"
            label={
              <>
                <span className="text-destructive">*</span> CEP
              </>
            }
            placeholder="CEP"
            readOnly
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
            readOnly
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
            readOnly
          />
          <FormField
            control={control}
            name="complemento"
            label="Complemento"
            placeholder="Complemento"
            readOnly
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
            readOnly
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
            readOnly
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
            placeholder="Selecione o Polo"
          />
        </>
      ) : null}
    </div>
  )
}
