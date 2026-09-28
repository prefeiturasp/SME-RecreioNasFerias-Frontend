import { useMemo } from 'react'
import type { Control } from 'react-hook-form'
import { OPCOES_AGRUPAMENTO, OPCOES_TIPO_ESTUDANTE } from '../constantes'
import type { FormValues } from '../schema'

import { AlertaErroApi } from '@/components/AlertaErroApi'
import { FormField } from '@/components/ui/form-field'
import { FormFieldEol } from '@/components/ui/form-field-eol'
import { FormFieldLeitura } from '@/components/ui/form-field-leitura'
import type { Dre } from '@/services/dre/types'
import type { PoloElegivel } from '@/services/inscricao/types'

type InformacoesBasicasProps = {
  control: Control<FormValues>
  agrupamento: string
  tipoTravado: boolean
  tipoEstudante: string
  dreCodigoEol: string
  dres: Dre[]
  polos: PoloElegivel[]
  erro?: unknown
  onBuscarCodigoEol?: (codigoEol: string) => void
  onBuscarCpf?: (cpf: string) => void
}

export function InformacoesBasicas({
  control,
  agrupamento,
  tipoTravado,
  tipoEstudante,
  dreCodigoEol,
  dres,
  polos,
  erro,
  onBuscarCodigoEol,
  onBuscarCpf,
}: Readonly<InformacoesBasicasProps>) {
  const rotuloTipoEstudante = useMemo(
    () =>
      OPCOES_TIPO_ESTUDANTE.find((opcao) => opcao.value === tipoEstudante)
        ?.label ?? '',
    [tipoEstudante],
  )

  return (
    <div className="grid gap-x-4 gap-y-5.5 lg:grid-cols-2">
      <AlertaErroApi erro={erro} className="lg:col-span-2" />
      <FormField
        control={control}
        name="agrupamento"
        label={
          <>
            <span className="text-destructive">*</span> Tipo de agrupamento
          </>
        }
        type="select"
        options={OPCOES_AGRUPAMENTO}
        placeholder="Selecione o tipo de agrupamento"
      />
      {agrupamento && tipoTravado ? (
        <FormFieldLeitura
          id="tipoEstudante"
          label={
            <>
              <span className="text-destructive">*</span> Tipo de estudante
            </>
          }
          value={rotuloTipoEstudante}
        />
      ) : null}
      {agrupamento && !tipoTravado ? (
        <FormField
          control={control}
          name="tipoEstudante"
          label={
            <>
              <span className="text-destructive">*</span> Tipo de estudante
            </>
          }
          type="select"
          options={OPCOES_TIPO_ESTUDANTE}
          placeholder="Selecione o tipo de estudante"
        />
      ) : null}
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
        onSearch={onBuscarCodigoEol}
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
    </div>
  )
}
