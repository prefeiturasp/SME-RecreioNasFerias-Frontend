import { CollapsibleFilter } from '@/components/CollapsibleFilter'
import { IconeFiltro } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetEdicoesPrograma } from '@/hooks/useGetEdicoesPrograma'
import { useGetTiposEscola } from '@/hooks/useGetTiposEscola'
import {
  OPCOES_TIPO_POLO,
  type FiltrosListagemDefinicaoPolos,
} from '@/services/definicaoPolo/types'
import { CampoFiltroSelect } from './CampoFiltroSelect'
import { useDefinicaoPoloStore } from '@/stores/filtroDefinicaoPolosStore'
import { useShallow } from 'zustand/react/shallow'

const OPCOES_GESTAO = [
  { valor: 'direta', rotulo: 'Direta' },
  { valor: 'parceira', rotulo: 'Parceira' },
] as const

export function FiltrosDefinicaoPolosForm() {
  const dresQuery = useGetDres()
  const tiposEscolaQuery = useGetTiposEscola()
  const edicoesQuery = useGetEdicoesPrograma()
  const { filtros, definirFiltros, aplicarFiltros, limparFiltros } =
    useDefinicaoPoloStore(
      useShallow((estado) => ({
        filtros: estado.filtros,
        definirFiltros: estado.definirFiltros,
        aplicarFiltros: estado.aplicarFiltros,
        limparFiltros: estado.limparFiltros,
      })),
    )

  function atualizarCampo(
    campo: keyof FiltrosListagemDefinicaoPolos,
    valor: string,
  ) {
    definirFiltros({ ...filtros, [campo]: valor })
  }

  return (
    <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Polos">
      <div aria-label="Filtrar polos" className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampoFiltroSelect
            id="filtro-dre"
            rotulo="Filtrar por DRE"
            placeholder="Selecione a DRE"
            valor={filtros.dre_codigos_eol}
            onValorChange={(valor) => atualizarCampo('dre_codigos_eol', valor)}
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

          <CampoFiltroSelect
            id="filtro-tipo-ue"
            rotulo="Filtrar por Tipo de UE"
            placeholder="Selecione o Tipo de UE"
            valor={filtros.tipo_ue}
            onValorChange={(valor) => atualizarCampo('tipo_ue', valor)}
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
                <SelectItem key={tipoUe.codigo} value={tipoUe.descricao_sigla}>
                  {tipoUe.descricao_sigla}
                </SelectItem>
              ))}
          </CampoFiltroSelect>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="filtro-nome-ue-codigo-eol" className="font-bold">
              Filtrar por Nome da UE ou Código EOL
            </Label>
            <Input
              id="filtro-nome-ue-codigo-eol"
              type="search"
              placeholder="Digite o Nome da UE ou Código EOL"
              className="h-10! rounded-sm border-input-border-muted"
              value={filtros.busca}
              onChange={(evento) =>
                atualizarCampo('busca', evento.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampoFiltroSelect
            id="filtro-nome-edicao"
            rotulo="Filtrar por Nome da Edição"
            placeholder={
              edicoesQuery.isLoading
                ? 'Carregando...'
                : 'Selecione o Nome da Edição'
            }
            valor={filtros.edicao}
            onValorChange={(valor) => atualizarCampo('edicao', valor)}
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

          <CampoFiltroSelect
            id="filtro-tipo-polo"
            rotulo="Tipo de Polo"
            placeholder="Selecione o Tipo de Polo"
            valor={filtros.tipo_polo}
            onValorChange={(valor) => atualizarCampo('tipo_polo', valor)}
          >
            {OPCOES_TIPO_POLO.map((tipoPolo) => (
              <SelectItem key={tipoPolo.valor} value={tipoPolo.valor}>
                {tipoPolo.rotulo}
              </SelectItem>
            ))}
          </CampoFiltroSelect>

          <CampoFiltroSelect
            id="filtro-gestao"
            rotulo="Gestão"
            placeholder="Selecione a Gestão"
            valor={filtros.gestao}
            onValorChange={(valor) => atualizarCampo('gestao', valor)}
          >
            {OPCOES_GESTAO.map((gestao) => (
              <SelectItem key={gestao.valor} value={gestao.valor}>
                {gestao.rotulo}
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
