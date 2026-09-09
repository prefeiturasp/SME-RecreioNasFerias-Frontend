import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CollapsibleFilter } from '@/components/CollapsibleFilter'
import { IconeFiltro } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { useGetTiposEscola } from '@/hooks/useGetTiposEscola'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'
import type { FiltrosListagemDefinicaoPolos } from '@/services/definicaoPolo/types'
import filtrosDefinicaoPolosSchema, {
  type FiltrosDefinicaoPolosFormValues,
} from './schema'

type FiltrosDefinicaoPolosFormProps = {
  onFiltrar: (filtros: FiltrosListagemDefinicaoPolos) => void
  onLimpar: () => void
}

const OPCOES_GESTAO = [
  { valor: 'direta', rotulo: 'Direta' },
  { valor: 'parceira', rotulo: 'Parceira' },
] as const

const OPCOES_TIPO_POLO = [
  { valor: 'pendente', rotulo: 'Pendente' },
  { valor: 'oficial', rotulo: 'Polo oficial' },
  { valor: 'reserva', rotulo: 'Polo reserva' },
] as const

type CampoFiltroSelectProps = {
  id: string
  rotulo: string
  placeholder: string
  valor: string
  onValorChange: (valor: string) => void
  children: ReactNode
}

function CampoFiltroSelect({
  id,
  rotulo,
  placeholder,
  valor,
  onValorChange,
  children,
}: Readonly<CampoFiltroSelectProps>) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="font-bold">
        {rotulo}
      </Label>
      <Select
        key={valor || 'sem-filtro'}
        value={valor || undefined}
        onValueChange={(valorSelecionado) => {
          if (valorSelecionado) onValorChange(valorSelecionado)
        }}
      >
        <SelectTrigger
          id={id}
          className="h-10! w-full rounded-sm border-input-border-muted"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}

export function FiltrosDefinicaoPolosForm({
  onFiltrar,
  onLimpar,
}: Readonly<FiltrosDefinicaoPolosFormProps>) {
  const dresQuery = useGetDres()
  const tiposEscolaQuery = useGetTiposEscola()
  const edicoesQuery = useGetEdicoesPrograma()

  const form = useForm<FiltrosDefinicaoPolosFormValues>({
    resolver: zodResolver(filtrosDefinicaoPolosSchema),
    defaultValues: FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS,
  })

  function onSubmit(dados: FiltrosDefinicaoPolosFormValues) {
    onFiltrar(dados)
  }

  function handleLimpar() {
    form.reset(FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS)
    onLimpar()
  }

  return (
    <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Polos">
      <form
        aria-label="Filtrar polos"
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="dre"
            control={form.control}
            render={({ field }) => (
              <CampoFiltroSelect
                id="filtro-dre"
                rotulo="Filtrar por DRE"
                placeholder="Selecione a DRE"
                valor={field.value}
                onValorChange={field.onChange}
              >
                {dresQuery.isLoading && (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                )}
                {dresQuery.isError && (
                  <SelectItem value="error" disabled>
                    Erro ao carregar DREs
                  </SelectItem>
                )}
                {!dresQuery.isLoading &&
                  !dresQuery.isError &&
                  dresQuery.data?.map((dre) => (
                    <SelectItem key={dre.codigo_dre} value={dre.codigo_dre}>
                      {dre.nome_dre}
                    </SelectItem>
                  ))}
              </CampoFiltroSelect>
            )}
          />

          <Controller
            name="tipoUe"
            control={form.control}
            render={({ field }) => (
              <CampoFiltroSelect
                id="filtro-tipo-ue"
                rotulo="Filtrar por Tipo de UE"
                placeholder="Selecione o Tipo de UE"
                valor={field.value}
                onValorChange={field.onChange}
              >
                {tiposEscolaQuery.isLoading && (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                )}
                {tiposEscolaQuery.isError && (
                  <SelectItem value="error" disabled>
                    Erro ao carregar tipos de escola
                  </SelectItem>
                )}
                {!tiposEscolaQuery.isLoading &&
                  !tiposEscolaQuery.isError &&
                  tiposEscolaQuery.data?.map((tipoUe) => (
                    <SelectItem
                      key={tipoUe.codigo}
                      value={tipoUe.descricao_sigla}
                    >
                      {tipoUe.descricao_sigla}
                    </SelectItem>
                  ))}
              </CampoFiltroSelect>
            )}
          />

          <Controller
            name="nomeUeOuCodigoEol"
            control={form.control}
            render={({ field }) => (
              <div className="flex min-w-0 flex-col gap-1.5">
                <Label
                  htmlFor="filtro-nome-ue-codigo-eol"
                  className="font-bold"
                >
                  Filtrar por Nome da UE ou Código EOL
                </Label>
                <Input
                  {...field}
                  id="filtro-nome-ue-codigo-eol"
                  type="search"
                  placeholder="Digite o Nome da UE ou Código EOL"
                  className="h-10! rounded-sm border-input-border-muted"
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="edicao"
            control={form.control}
            render={({ field }) => (
              <CampoFiltroSelect
                id="filtro-nome-edicao"
                rotulo="Filtrar por Nome da Edição"
                placeholder={
                  edicoesQuery.isLoading
                    ? 'Carregando...'
                    : 'Selecione o Nome da Edição'
                }
                valor={field.value}
                onValorChange={field.onChange}
              >
                {edicoesQuery.isLoading && (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                )}
                {edicoesQuery.isError && (
                  <SelectItem value="error" disabled>
                    Erro ao carregar edições
                  </SelectItem>
                )}
                {!edicoesQuery.isLoading &&
                  !edicoesQuery.isError &&
                  edicoesQuery.data?.map((edicao) => (
                    <SelectItem key={edicao.uuid} value={edicao.uuid}>
                      {edicao.nome}
                    </SelectItem>
                  ))}
              </CampoFiltroSelect>
            )}
          />

          <Controller
            name="tipoPolo"
            control={form.control}
            render={({ field }) => (
              <CampoFiltroSelect
                id="filtro-tipo-polo"
                rotulo="Tipo de Polo"
                placeholder="Selecione o Tipo de Polo"
                valor={field.value}
                onValorChange={field.onChange}
              >
                {OPCOES_TIPO_POLO.map((tipoPolo) => (
                  <SelectItem key={tipoPolo.valor} value={tipoPolo.valor}>
                    {tipoPolo.rotulo}
                  </SelectItem>
                ))}
              </CampoFiltroSelect>
            )}
          />

          <Controller
            name="gestao"
            control={form.control}
            render={({ field }) => (
              <CampoFiltroSelect
                id="filtro-gestao"
                rotulo="Gestão"
                placeholder="Selecione a Gestão"
                valor={field.value}
                onValorChange={field.onChange}
              >
                {OPCOES_GESTAO.map((gestao) => (
                  <SelectItem key={gestao.valor} value={gestao.valor}>
                    {gestao.rotulo}
                  </SelectItem>
                ))}
              </CampoFiltroSelect>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleLimpar}>
            Limpar Filtros
          </Button>
          <Button type="submit">Filtrar</Button>
        </div>
      </form>
    </CollapsibleFilter>
  )
}
