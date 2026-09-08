import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ChevronDownIcon, IconeFiltro } from '@/components/icons'
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

export function FiltrosDefinicaoPolosForm({
  onFiltrar,
  onLimpar,
}: Readonly<FiltrosDefinicaoPolosFormProps>) {
  const [expandido, setExpandido] = useState(true)
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

  function renderizarDemaisFiltros() {
    const opcoesNomeEdicao = edicoesQuery.data ?? []

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          name="edicao"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="filtro-nome-edicao" className="font-bold">
                Filtrar por Nome da Edição
              </Label>
              <select
                {...field}
                id="filtro-nome-edicao"
                className="h-10 w-full rounded-sm border border-input-border-muted bg-background px-3 text-sm"
                disabled={edicoesQuery.isLoading}
              >
                <option value="">
                  {edicoesQuery.isLoading
                    ? 'Carregando...'
                    : 'Selecione o Nome da Edição'}
                </option>
                {opcoesNomeEdicao.map((edicao) => (
                  <option key={edicao.uuid} value={edicao.uuid}>
                    {edicao.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <Controller
          name="tipoPolo"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="filtro-tipo-polo" className="font-bold">
                Tipo de Polo
              </Label>
              <select
                {...field}
                id="filtro-tipo-polo"
                className="h-10 w-full rounded-sm border border-input-border-muted bg-background px-3 text-sm"
              >
                <option value="">Selecione o Tipo de Polo</option>
                {OPCOES_TIPO_POLO.map((tipoPolo) => (
                  <option key={tipoPolo.valor} value={tipoPolo.valor}>
                    {tipoPolo.rotulo}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <Controller
          name="gestao"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="filtro-gestao" className="font-bold">
                Gestão
              </Label>
              <select
                {...field}
                id="filtro-gestao"
                className="h-10 w-full rounded-sm border border-input-border-muted bg-background px-3 text-sm"
              >
                <option value="">Selecione a Gestão</option>
                {OPCOES_GESTAO.map((gestao) => (
                  <option key={gestao.valor} value={gestao.valor}>
                    {gestao.rotulo}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
      </div>
    )
  }

  return (
    <section
      aria-label="Filtrar polos"
      className="rounded-sm bg-background p-4 shadow-card"
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left font-bold text-brand-dark"
        aria-expanded={expandido}
        aria-controls="corpo-filtros-definicao-polos"
        onClick={() => setExpandido((atual) => !atual)}
      >
        <IconeFiltro />
        <span>Filtrar Polos</span>
        <ChevronDownIcon
          className={`ml-auto transition-transform ${expandido ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {expandido && (
        <form
          id="corpo-filtros-definicao-polos"
          className="mt-4 flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Controller
              name="dre"
              control={form.control}
              render={({ field }) => (
                <div className="flex min-w-0 flex-col gap-1.5">
                  <Label htmlFor="filtro-dre" className="font-bold">
                    Filtrar por DRE
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={(valor) => {
                      if (valor) field.onChange(valor)
                    }}
                  >
                    <SelectTrigger
                      id="filtro-dre"
                      className="h-10 w-full rounded-sm border-input-border-muted data-[size=default]:h-10"
                    >
                      <SelectValue placeholder="Selecione a DRE" />
                    </SelectTrigger>
                    <SelectContent>
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
                          <SelectItem
                            key={dre.codigo_dre}
                            value={dre.codigo_dre}
                          >
                            {dre.nome_dre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="tipoUe"
              control={form.control}
              render={({ field }) => (
                <div className="flex min-w-0 flex-col gap-1.5">
                  <Label htmlFor="filtro-tipo-ue" className="font-bold">
                    Filtrar por Tipo de UE
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={(valor) => {
                      if (valor) field.onChange(valor)
                    }}
                  >
                    <SelectTrigger
                      id="filtro-tipo-ue"
                      className="h-10 w-full rounded-sm border-input-border-muted data-[size=default]:h-10"
                    >
                      <SelectValue placeholder="Selecione o Tipo de UE" />
                    </SelectTrigger>
                    <SelectContent>
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
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="nomeUeOuCodigoEol"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
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
                    className="h-10 rounded-sm border-input-border-muted"
                  />
                </div>
              )}
            />
          </div>

          {renderizarDemaisFiltros()}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleLimpar}>
              Limpar Filtros
            </Button>
            <Button type="submit">Filtrar</Button>
          </div>
        </form>
      )}
    </section>
  )
}
