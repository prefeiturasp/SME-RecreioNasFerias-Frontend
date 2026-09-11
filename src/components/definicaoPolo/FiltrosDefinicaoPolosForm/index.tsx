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
import {
  OPCOES_TIPO_POLO,
  type FiltrosListagemDefinicaoPolos,
} from '@/services/definicaoPolo/types'
import type { ReactNode } from 'react'

type FiltrosDefinicaoPolosFormProps = {
  valores: FiltrosListagemDefinicaoPolos
  onChange: (filtros: FiltrosListagemDefinicaoPolos) => void
  onFiltrar: () => void
  onLimpar: () => void
}

const OPCOES_GESTAO = [
  { valor: 'direta', rotulo: 'Direta' },
  { valor: 'parceira', rotulo: 'Parceira' },
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
  valores,
  onChange,
  onFiltrar,
  onLimpar,
}: Readonly<FiltrosDefinicaoPolosFormProps>) {
  const dresQuery = useGetDres()
  const tiposEscolaQuery = useGetTiposEscola()
  const edicoesQuery = useGetEdicoesPrograma()

  function atualizarCampo(
    campo: keyof FiltrosListagemDefinicaoPolos,
    valor: string,
  ) {
    onChange({ ...valores, [campo]: valor })
  }

  return (
    <CollapsibleFilter icon={<IconeFiltro />} title="Filtrar Polos">
      <div aria-label="Filtrar polos" className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampoFiltroSelect
            id="filtro-dre"
            rotulo="Filtrar por DRE"
            placeholder="Selecione a DRE"
            valor={valores.dre}
            onValorChange={(valor) => atualizarCampo('dre', valor)}
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
            valor={valores.tipoUe}
            onValorChange={(valor) => atualizarCampo('tipoUe', valor)}
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
              value={valores.nomeUeOuCodigoEol}
              onChange={(evento) =>
                atualizarCampo('nomeUeOuCodigoEol', evento.target.value)
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
            valor={valores.edicao}
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
            valor={valores.tipoPolo}
            onValorChange={(valor) => atualizarCampo('tipoPolo', valor)}
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
            valor={valores.gestao}
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
          <Button type="button" variant="outline" onClick={onLimpar}>
            Limpar Filtros
          </Button>
          <Button type="button" onClick={onFiltrar}>
            Filtrar
          </Button>
        </div>
      </div>
    </CollapsibleFilter>
  )
}
