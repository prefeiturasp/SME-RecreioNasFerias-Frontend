import { useState } from 'react'

import { ChevronDownIcon, IconeFiltro } from '../../components/icons'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { useOpcoesIntegracaoPolosParceiros } from '../../services/smeIntegracao/useOpcoesIntegracaoPolosParceiros'
import type { FiltrosListagemPolosParceiros } from '../../services/poloParceiro/types'
import {
  BotaoCancelarFormulario as BotaoLimparFiltros,
  BotaoSalvarFormulario as BotaoFiltrar,
} from '../shared/edicoesProgramaStyles'
import {
  BotaoCabecalhoFiltrosPolos,
  CabecalhoFiltrosPolos,
  CampoFiltroPolos,
  CartaoFiltrosPolos,
  CorpoFiltrosPolos,
  IconeChevronFiltrosPolos,
  LinhaBotoesFiltrosPolos,
  LinhaCamposFiltrosPolos,
  SeletorCampoFiltroPolos,
  TituloFiltrosPolos,
} from './filtrosStyles'

type FiltrosPolosParceirosProps = {
  valores: FiltrosListagemPolosParceiros
  onChange: (valores: FiltrosListagemPolosParceiros) => void
  onLimpar: () => void
  onFiltrar: () => void
}

export function FiltrosPolosParceiros({
  valores,
  onChange,
  onLimpar,
  onFiltrar,
}: Readonly<FiltrosPolosParceirosProps>) {
  const [expandido, setExpandido] = useState(true)
  const { opcoesDre, opcoesTipoUe, estaCarregando } =
    useOpcoesIntegracaoPolosParceiros()

  const atualizarCampo = (
    campo: keyof FiltrosListagemPolosParceiros,
    valor: string,
  ) => {
    onChange({
      ...valores,
      [campo]: valor,
    })
  }

  return (
    <CartaoFiltrosPolos aria-label="Filtrar polos">
      <CabecalhoFiltrosPolos>
        <BotaoCabecalhoFiltrosPolos
          type="button"
          aria-expanded={expandido}
          aria-controls="corpo-filtros-polos"
          onClick={() => setExpandido((atual) => !atual)}
        >
          <IconeFiltro />
          <TituloFiltrosPolos>Filtrar Polos</TituloFiltrosPolos>
          <IconeChevronFiltrosPolos $expandido={expandido} aria-hidden="true">
            <ChevronDownIcon />
          </IconeChevronFiltrosPolos>
        </BotaoCabecalhoFiltrosPolos>
      </CabecalhoFiltrosPolos>

      {expandido && (
        <CorpoFiltrosPolos id="corpo-filtros-polos">
          {estaCarregando ? (
            <IndicadorCarregamento mensagem="Carregando opções dos filtros..." />
          ) : (
            <>
              <LinhaCamposFiltrosPolos>
                <CampoFiltroPolos>
                  <label htmlFor="filtro-dre">Filtrar por DRE</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-dre"
                      value={valores.dre}
                      onChange={(evento) =>
                        atualizarCampo('dre', evento.target.value)
                      }
                    >
                      <option value="">Selecione a DRE</option>
                      {opcoesDre.map((dre) => (
                        <option key={dre.codigo} value={dre.nome}>
                          {dre.nome}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-tipo-ue">Filtrar por Tipo de UE</label>
                  <SeletorCampoFiltroPolos>
                    <select
                      id="filtro-tipo-ue"
                      value={valores.tipoUe}
                      onChange={(evento) =>
                        atualizarCampo('tipoUe', evento.target.value)
                      }
                    >
                      <option value="">Selecione o Tipo de UE</option>
                      {opcoesTipoUe.map((tipoUe) => (
                        <option
                          key={tipoUe.codigo}
                          value={tipoUe.descricaoSigla}
                        >
                          {tipoUe.descricaoSigla}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>

                <CampoFiltroPolos>
                  <label htmlFor="filtro-nome-polo-osc">
                    Filtrar por Nome do Polo ou da OSC
                  </label>
                  <SeletorCampoFiltroPolos>
                    <input
                      id="filtro-nome-polo-osc"
                      type="search"
                      value={valores.nomePoloOuOsc}
                      placeholder="Digite nome do Polo ou da OSC"
                      onChange={(evento) =>
                        atualizarCampo('nomePoloOuOsc', evento.target.value)
                      }
                    />
                  </SeletorCampoFiltroPolos>
                </CampoFiltroPolos>
              </LinhaCamposFiltrosPolos>

              <LinhaBotoesFiltrosPolos>
                <BotaoLimparFiltros type="button" onClick={onLimpar}>
                  Limpar Filtros
                </BotaoLimparFiltros>
                <BotaoFiltrar type="button" onClick={onFiltrar}>
                  Filtrar
                </BotaoFiltrar>
              </LinhaBotoesFiltrosPolos>
            </>
          )}
        </CorpoFiltrosPolos>
      )}
    </CartaoFiltrosPolos>
  )
}
