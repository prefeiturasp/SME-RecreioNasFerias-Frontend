import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { ChevronDownIcon, IconeFiltro } from '@/components/icons'
import { IndicadorCarregamento } from '@/components/IndicadorCarregamento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetOpcoesFiltroDefinicaoPolos } from '@/hooks/useGetOpcoesFiltroDefinicaoPolos'
import { FILTROS_LISTAGEM_DEFINICAO_POLOS_INICIAIS } from '@/services/definicaoPolo/types'
import type { FiltrosListagemDefinicaoPolos } from '@/services/definicaoPolo/types'
import filtrosDefinicaoPolosSchema, {
  type FiltrosDefinicaoPolosFormValues,
} from './schema'

type FiltrosDefinicaoPolosFormProps = {
  onFiltrar: (filtros: FiltrosListagemDefinicaoPolos) => void
  onLimpar: () => void
}

export function FiltrosDefinicaoPolosForm({
  onFiltrar,
  onLimpar,
}: Readonly<FiltrosDefinicaoPolosFormProps>) {
  const [expandido, setExpandido] = useState(true)
  const opcoesQuery = useGetOpcoesFiltroDefinicaoPolos()

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

  function renderizarCamposFiltro() {
    if (opcoesQuery.isPending) {
      return (
        <IndicadorCarregamento mensagem="Carregando opções dos filtros..." />
      )
    }

    if (opcoesQuery.isError) {
      return <AlertaErroApi erro={opcoesQuery.error} />
    }

    const opcoesDre = opcoesQuery.data?.dres ?? []
    const opcoesTipoUe = opcoesQuery.data?.tiposUe ?? []
    const opcoesGestao = opcoesQuery.data?.gestoes ?? []
    const opcoesNomeEdicao = opcoesQuery.data?.nomesEdicao ?? []
    const opcoesTipoPolo = opcoesQuery.data?.tiposPolo ?? []

    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="dre"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="filtro-dre" className="font-bold">
                  Filtrar por DRE
                </Label>
                <select
                  {...field}
                  id="filtro-dre"
                  className="h-10 w-full rounded-sm border border-input-border-muted bg-background px-3 text-sm"
                >
                  <option value="">Selecione a DRE</option>
                  {opcoesDre.map((dre) => (
                    <option key={dre} value={dre}>
                      {dre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <Controller
            name="tipoUe"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="filtro-tipo-ue" className="font-bold">
                  Filtrar por Tipo de UE
                </Label>
                <select
                  {...field}
                  id="filtro-tipo-ue"
                  className="h-10 w-full rounded-sm border border-input-border-muted bg-background px-3 text-sm"
                >
                  <option value="">Selecione o Tipo de UE</option>
                  {opcoesTipoUe.map((tipoUe) => (
                    <option key={tipoUe} value={tipoUe}>
                      {tipoUe}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <Controller
            name="nomeUeOuCodigoEol"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="filtro-nome-ue-codigo-eol" className="font-bold">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="nomeEdicao"
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
                >
                  <option value="">Selecione o Nome da Edição</option>
                  {opcoesNomeEdicao.map((edicao) => (
                    <option key={edicao} value={edicao}>
                      {edicao}
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
                  {opcoesTipoPolo.map((tipoPolo) => (
                    <option key={tipoPolo} value={tipoPolo}>
                      {tipoPolo}
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
                  {opcoesGestao.map((gestao) => (
                    <option key={gestao} value={gestao}>
                      {gestao}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleLimpar}>
            Limpar Filtros
          </Button>
          <Button type="submit">Filtrar</Button>
        </div>
      </>
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
          {renderizarCamposFiltro()}
        </form>
      )}
    </section>
  )
}
