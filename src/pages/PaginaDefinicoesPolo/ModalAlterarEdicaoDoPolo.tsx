import { useEffect, useState } from 'react'

import { ChevronDownIcon, CloseIcon } from '../../components/icons'
import { IndicadorCarregamento } from '../../components/IndicadorCarregamento'
import { listarEdicoesPrograma } from '../../services/edicaoPrograma/api'
import {
  BotaoAlterarModalAlterarEdicao,
  BotaoFecharModalAlterarEdicao,
  BotaoFecharRodapeModalAlterarEdicao,
  CabecalhoModalAlterarEdicao,
  CampoModalAlterarEdicao,
  ConteudoModalAlterarEdicao,
  CorpoModalAlterarEdicao,
  DescricaoModalAlterarEdicao,
  RodapeModalAlterarEdicao,
  SeletorModalAlterarEdicao,
  SobreposicaoModalAlterarEdicao,
  TituloModalAlterarEdicao,
} from './modalAlterarEdicaoDoPoloStyles'

const NOME_EDICAO_SEM_VINCULO = '-'
const TAMANHO_PAGINA_EDICOES = 100

type ModalAlterarEdicaoDoPoloProps = {
  aberto: boolean
  estaSalvando?: boolean
  mensagemErro?: string | null
  onFechar: () => void
  onAlterar: (nomeEdicao: string) => void
}

export function ModalAlterarEdicaoDoPolo({
  aberto,
  estaSalvando = false,
  mensagemErro = null,
  onFechar,
  onAlterar,
}: Readonly<ModalAlterarEdicaoDoPoloProps>) {
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [opcoesNomeEdicao, setOpcoesNomeEdicao] = useState<string[]>([])
  const [estaCarregandoOpcoes, setEstaCarregandoOpcoes] = useState(false)

  useEffect(() => {
    if (!aberto) {
      setNomeEdicao('')
      return
    }

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && !estaSalvando) {
        onFechar()
      }
    }

    globalThis.addEventListener('keydown', fecharComEscape)
    return () => globalThis.removeEventListener('keydown', fecharComEscape)
  }, [aberto, estaSalvando, onFechar])

  useEffect(() => {
    if (!aberto) return

    let cancelado = false
    setEstaCarregandoOpcoes(true)

    void listarEdicoesPrograma({
      pagina: 1,
      tamanhoPagina: TAMANHO_PAGINA_EDICOES,
    })
      .then((listagem) => {
        if (cancelado) return

        const nomes = Array.from(
          new Set(
            listagem.edicoes
              .map((edicao) => edicao.nome.trim())
              .filter((nome) => nome !== ''),
          ),
        ).sort((a, b) => a.localeCompare(b, 'pt-BR'))

        setOpcoesNomeEdicao([NOME_EDICAO_SEM_VINCULO, ...nomes])
      })
      .catch(() => {
        if (!cancelado) {
          setOpcoesNomeEdicao([NOME_EDICAO_SEM_VINCULO])
        }
      })
      .finally(() => {
        if (!cancelado) {
          setEstaCarregandoOpcoes(false)
        }
      })

    return () => {
      cancelado = true
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <SobreposicaoModalAlterarEdicao
      onClick={() => {
        if (!estaSalvando) onFechar()
      }}
    >
      <ConteudoModalAlterarEdicao
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-alterar-edicao-do-polo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <CabecalhoModalAlterarEdicao>
          <TituloModalAlterarEdicao id="titulo-alterar-edicao-do-polo">
            Alterar Edição do Polo
          </TituloModalAlterarEdicao>
          <BotaoFecharModalAlterarEdicao
            type="button"
            aria-label="Fechar"
            disabled={estaSalvando}
            onClick={onFechar}
          >
            <CloseIcon />
          </BotaoFecharModalAlterarEdicao>
        </CabecalhoModalAlterarEdicao>

        <CorpoModalAlterarEdicao>
          <DescricaoModalAlterarEdicao>
            Selecione o Nome da Edição que deseja vincular ao(s) Polo(s):
          </DescricaoModalAlterarEdicao>

          {estaCarregandoOpcoes ? (
            <IndicadorCarregamento mensagem="Carregando edições..." />
          ) : (
            <CampoModalAlterarEdicao>
              <label htmlFor="modal-nome-edicao">
                Selecione o Nome da Edição
              </label>
              <SeletorModalAlterarEdicao>
                <select
                  id="modal-nome-edicao"
                  value={nomeEdicao}
                  disabled={estaSalvando}
                  onChange={(evento) => setNomeEdicao(evento.target.value)}
                >
                  <option value="">Selecione o Nome da Edição</option>
                  {opcoesNomeEdicao.map((edicao) => (
                    <option key={edicao} value={edicao}>
                      {edicao}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </SeletorModalAlterarEdicao>
            </CampoModalAlterarEdicao>
          )}

          {mensagemErro ? (
            <DescricaoModalAlterarEdicao role="alert">
              {mensagemErro}
            </DescricaoModalAlterarEdicao>
          ) : null}
        </CorpoModalAlterarEdicao>

        <RodapeModalAlterarEdicao>
          <BotaoFecharRodapeModalAlterarEdicao
            type="button"
            disabled={estaSalvando}
            onClick={onFechar}
          >
            Fechar
          </BotaoFecharRodapeModalAlterarEdicao>
          <BotaoAlterarModalAlterarEdicao
            type="button"
            disabled={!nomeEdicao || estaSalvando || estaCarregandoOpcoes}
            onClick={() => onAlterar(nomeEdicao)}
          >
            {estaSalvando ? 'Alterando...' : 'Alterar'}
          </BotaoAlterarModalAlterarEdicao>
        </RodapeModalAlterarEdicao>
      </ConteudoModalAlterarEdicao>
    </SobreposicaoModalAlterarEdicao>
  )
}
