import { CollapsibleFilter } from '@/components/CollapsibleFilter'
import { IconeFiltro } from '@/components/icons'
import { CampoFiltroSelect } from '../../definicaoPolo/FiltrosDefinicaoPolosForm/CampoFiltroSelect'
import { type FiltrosIncricoesParticipantes } from '@/services/inscricao/types'
import { SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useInscricoesParticipantesStore } from '@/stores/filtroInscricoesParticipantesStore'
import { useShallow } from 'zustand/react/shallow'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { useMemo } from 'react'
import { CampoFiltroCombobox } from '@/components/participante/CampoFiltroCombobox'
import { aplicarMascaraCpf, extrairDigitos } from '@/utils/mascarasEntrada'
import { useGetPolosOficiais } from '@/hooks/useGetPolosOficiais'

export function FiltrosInscricoesParticipantesForm() {
  const { filtros, definirFiltros, aplicarFiltros, limparFiltros } =
    useInscricoesParticipantesStore(
      useShallow((estado) => ({
        filtros: estado.filtros,
        definirFiltros: estado.definirFiltros,
        aplicarFiltros: estado.aplicarFiltros,
        limparFiltros: estado.limparFiltros,
      })),
    )

  function atualizarCampo(
    campo: keyof FiltrosIncricoesParticipantes,
    valor: string,
  ) {
    definirFiltros({ ...filtros, [campo]: valor })
  }

  const choicesQuery = useGetValoresChoices()
  const tiposEstudante = useMemo(
    () => choicesQuery.data?.tipo_estudante ?? [],
    [choicesQuery.data?.tipo_estudante],
  )
  const grupos = useMemo(
    () => choicesQuery.data?.grupo_inscricao ?? [],
    [choicesQuery.data?.grupo_inscricao],
  )
  const status = useMemo(
    () => choicesQuery.data?.status_inscricao ?? [],
    [choicesQuery.data?.status_inscricao],
  )

  const polosOficiaisQuery = useGetPolosOficiais()

  return (
    <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Inscrições">
      <div aria-label="Filtrar polos" className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampoFiltroSelect
            id="filtro-tipo-estudante"
            rotulo="Filtrar por Tipo de Estudante"
            placeholder="Selecione o Tipo de Estudante"
            valor={filtros.tipo_estudante}
            onValorChange={(valor) => atualizarCampo('tipo_estudante', valor)}
          >
            {choicesQuery.isLoading && (
              <SelectItem value="loading" disabled>
                Carregando...
              </SelectItem>
            )}
            {choicesQuery.isError && (
              <SelectItem value="error" disabled>
                Erro ao carregar Tipos de Estudante
              </SelectItem>
            )}
            {!choicesQuery.isLoading &&
              !choicesQuery.isError &&
              tiposEstudante.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
          </CampoFiltroSelect>

          <CampoFiltroCombobox
            id="filtro-polo-inscricao"
            rotulo="Filtrar por Polo de Inscrição"
            placeholder="Selecione o Polo de Inscrição"
            valor={filtros.polo}
            opcoes={
              polosOficiaisQuery.data?.map((polo) => ({
                value: polo.uuid,
                label: polo.nome_polo,
              })) ?? []
            }
            onValorChange={(valor) => atualizarCampo('polo', valor)}
          />

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="filtro-codigo-eol" className="font-bold">
              Filtrar por Código EOL
            </Label>
            <Input
              id="filtro-codigo-eol"
              type="search"
              inputMode="numeric"
              maxLength={7}
              placeholder="Digite o Código EOL"
              className="h-10! rounded-sm border-input-border-muted"
              value={filtros.codigo_eol}
              onChange={(evento) =>
                atualizarCampo('codigo_eol', evento.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="filtro-cpf" className="font-bold">
              Filtrar por CPF
            </Label>
            <Input
              id="filtro-cpf"
              type="search"
              inputMode="numeric"
              maxLength={14}
              placeholder="Digite o CPF"
              className="h-10! rounded-sm border-input-border-muted"
              value={aplicarMascaraCpf(filtros.cpf)}
              onChange={(evento) =>
                atualizarCampo(
                  'cpf',
                  extrairDigitos(evento.target.value).slice(0, 11),
                )
              }
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="filtro-nome-participante" className="font-bold">
              Filtrar por Nome do Participante
            </Label>
            <Input
              id="filtro-nome-participante"
              type="search"
              placeholder="Digite o Nome do Participante"
              className="h-10! rounded-sm border-input-border-muted"
              value={filtros.nome_participante}
              onChange={(evento) =>
                atualizarCampo('nome_participante', evento.target.value)
              }
            />
          </div>

          <CampoFiltroSelect
            id="filtro-grupo"
            rotulo="Filtrar por Agrupamento"
            placeholder="Selecione o Grupo"
            valor={filtros.grupo}
            onValorChange={(valor) => atualizarCampo('grupo', valor)}
          >
            {grupos.map((grupo) => (
              <SelectItem key={grupo.value} value={grupo.value}>
                {grupo.label}
              </SelectItem>
            ))}
          </CampoFiltroSelect>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampoFiltroSelect
            id="filtro-gestao"
            rotulo="Filtrar por Status"
            placeholder="Selecione o Status"
            valor={filtros.status}
            onValorChange={(valor) => atualizarCampo('status', valor)}
          >
            {status.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </CampoFiltroSelect>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
          <Button type="button" onClick={aplicarFiltros}>
            Filtrar
          </Button>
        </div>
      </div>
    </CollapsibleFilter>
  )
}
