import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FiltrosPolo } from '@/constants/filtroPolos'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetTiposEscola } from '@/hooks/useGetTiposEscola'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Dre } from '@/services/dre/types'
import { usePoloParceiroStore } from '@/stores/filtroPolosParceirosStore'
import { useShallow } from 'zustand/react/shallow'

export function Filtros() {
  const {
    data: dres,
    isLoading: carregandoDres,
    isError: erroDres,
  } = useGetDres()

  const {
    data: tiposEscola,
    isLoading: carregandoTiposEscola,
    isError: erroTiposEscola,
  } = useGetTiposEscola()

  const { filtros, definirFiltros, aplicarFiltros, limparFiltros } =
    usePoloParceiroStore(
      useShallow((estado) => ({
        filtros: estado.filtros,
        definirFiltros: estado.definirFiltros,
        aplicarFiltros: estado.aplicarFiltros,
        limparFiltros: estado.limparFiltros,
      })),
    )

  function atualizarCampo(campo: keyof FiltrosPolo, valor: string) {
    definirFiltros({ ...filtros, [campo]: valor })
  }

  return (
    <div aria-label="Filtrar polos" className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="filtro-polo-dre" className="font-bold">
            Filtrar por DRE
          </Label>
          <Select
            value={filtros.dre_codigo_eol}
            onValueChange={(valor) => atualizarCampo('dre_codigo_eol', valor)}
          >
            <SelectTrigger
              id="filtro-polo-dre"
              className="h-10! w-full rounded-sm border-input-border-muted font-bold"
            >
              <SelectValue placeholder="Selecione a DRE" />
            </SelectTrigger>

            <SelectContent>
              {carregandoDres && (
                <SelectItem value="loading" disabled>
                  Carregando...
                </SelectItem>
              )}

              {erroDres && (
                <SelectItem value="error" disabled>
                  Erro ao carregar DREs
                </SelectItem>
              )}

              {!carregandoDres &&
                !erroDres &&
                dres?.map((dre: Dre) => (
                  <SelectItem key={dre.codigo_dre} value={dre.codigo_dre}>
                    {dre.nome_dre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="filtro-polo-tipo-escola" className="font-bold">
            Filtrar por Tipo de UE
          </Label>

          <Select
            value={filtros.tipo_ue}
            onValueChange={(valor) => atualizarCampo('tipo_ue', valor)}
          >
            <SelectTrigger
              id="filtro-polo-tipo-escola"
              className="h-10! w-full rounded-sm border-input-border-muted"
            >
              <SelectValue placeholder="Selecione o Tipo de UE" />
            </SelectTrigger>

            <SelectContent>
              {carregandoTiposEscola && (
                <SelectItem value="loading" disabled>
                  Carregando...
                </SelectItem>
              )}

              {erroTiposEscola && (
                <SelectItem value="error" disabled>
                  Erro ao carregar tipos de escola
                </SelectItem>
              )}

              {!carregandoTiposEscola &&
                !erroTiposEscola &&
                tiposEscola?.map((tipo) => (
                  <SelectItem key={tipo.codigo} value={tipo.descricao_sigla}>
                    {tipo.descricao_sigla}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="filtro-polo-busca" className="font-bold">
            Filtrar por Nome do Polo ou da OSC
          </Label>
          <Input
            id="filtro-polo-busca"
            type="search"
            placeholder="Digite nome do Polo ou da OSC"
            className="h-10! rounded-sm border-input-border-muted"
            value={filtros.busca}
            onChange={(evento) => atualizarCampo('busca', evento.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={limparFiltros}>
          Limpar Filtros
        </Button>
        <Button type="button" variant="default" onClick={aplicarFiltros}>
          Filtrar
        </Button>
      </div>
    </div>
  )
}
