import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SubmitEvent,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { MensagemAlerta } from '@/components/shared/mensagem-alerta'
import { Botao, BotaoVoltar } from '@/components/shared/botao'
import { CartaoFormulario } from '@/components/shared/cartao-conteudo'
import { AcoesFormulario } from '@/components/shared/campo-formulario'
import { IndicadorCarregamento } from '@/components/shared/indicador-carregamento'
import { MapaVisual } from '@/components/shared/mapa-visual'
import { CabecalhoPagina } from '@/components/shared/cabecalho-pagina'
import {
  AreaConteudo,
  ContainerPagina,
  SecaoPrincipal,
} from '@/components/shared/estrutura-pagina'
import { CabecalhoSecao } from '@/components/shared/cabecalho-secao'
import { MenuLateral } from '@/components/shared/menu-lateral'
import {
  atualizarEdicaoPrograma,
  ErroAtualizacaoEdicaoPrograma,
  ErroObterEdicaoPrograma,
  obterEdicaoPrograma,
} from '../../services/edicaoPrograma/api'
import {
  dadosFormularioEdicaoSaoIguais,
  obterDadosFormularioEdicao,
} from '../../services/edicaoPrograma/obterDadosFormularioEdicao'
import type {
  DadosCadastroEdicaoPrograma,
  EdicaoPrograma,
} from '../../services/edicaoPrograma/types'
import { validarCadastroEdicao } from '../../services/edicaoPrograma/validarCadastroEdicao'
import { CamposFormularioEditarEdicao } from './CamposFormularioEditarEdicao'
import { ModalConfirmacaoSalvarEdicaoPrograma } from './ModalConfirmacaoSalvarEdicaoPrograma'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Edições do programa', caminho: '/edicoes-programa' },
  { rotulo: 'Editar Edição do Programa' },
] as const

function montarCamposNumericosDesabilitados(edicao: EdicaoPrograma) {
  return [
    {
      id: 'QuantidadeInscritos',
      rotulo: 'Quantidade de Inscritos',
      placeholder: 'Quantidade de Inscritos',
      valor: edicao.quantidadeInscritos,
    },
    {
      id: 'QuantidadeAtendimentoEfetivo',
      rotulo: 'Quantidade de Atendimento Efetivo',
      placeholder: 'Quantidade de Atendimento Efetivo',
      valor: edicao.quantidadeAtendimentoEfetivo,
    },
    {
      id: 'QuantidadePasseios',
      rotulo: 'Quantidade de Passeios',
      placeholder: 'Quantidade de Passeios',
      valor: edicao.quantidadePasseios,
    },
    {
      id: 'QuantidadeApresentacoes',
      rotulo: 'Quantidade de Apresentações',
      placeholder: 'Quantidade de Apresentações',
      valor: edicao.quantidadeApresentacoes,
    },
  ] as const
}

function mensagemErroAoCarregarEdicao(error: unknown): string {
  if (error instanceof ErroObterEdicaoPrograma) {
    return error.mensagemUsuario
  }

  return 'Não foi possível carregar a edição do programa.'
}

function montarValoresIniciais(
  edicao: EdicaoPrograma,
): DadosCadastroEdicaoPrograma {
  return {
    nome: edicao.nome,
    dataInicioEdicao: edicao.dataInicioEdicao,
    dataFimEdicao: edicao.dataFimEdicao,
    dataInicioInscricoes: edicao.dataInicioInscricoes,
    dataFimInscricoes: edicao.dataFimInscricoes,
  }
}

export default function PaginaEditarEdicaoPrograma() {
  const navigate = useNavigate()
  const { idEdicao } = useParams<{ idEdicao: string }>()
  const [edicao, setEdicao] = useState<EdicaoPrograma | null>(null)
  const [estaCarregando, setEstaCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioAlterado, setFormularioAlterado] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const valoresIniciaisRef = useRef<DadosCadastroEdicaoPrograma | null>(null)
  const formularioRef = useRef<HTMLFormElement>(null)

  const voltarParaEdicoes = useCallback(
    () => navigate('/edicoes-programa'),
    [navigate],
  )

  useEffect(() => {
    if (!idEdicao) {
      setEstaCarregando(false)
      setMensagemErro('Edição do programa não encontrada.')
      return
    }

    setEstaCarregando(true)
    setMensagemErro(null)

    void obterEdicaoPrograma(idEdicao)
      .then(setEdicao)
      .catch((error: unknown) => {
        setEdicao(null)
        setMensagemErro(mensagemErroAoCarregarEdicao(error))
      })
      .finally(() => {
        setEstaCarregando(false)
      })
  }, [idEdicao])

  useEffect(() => {
    if (!edicao) {
      valoresIniciaisRef.current = null
      setFormularioAlterado(false)
      return
    }

    valoresIniciaisRef.current = montarValoresIniciais(edicao)
    setFormularioAlterado(false)
  }, [edicao])

  const detectarAlteracaoFormulario = useCallback((form: HTMLFormElement) => {
    if (!valoresIniciaisRef.current) return

    const dadosAtuais = obterDadosFormularioEdicao(form)
    setFormularioAlterado(
      !dadosFormularioEdicaoSaoIguais(dadosAtuais, valoresIniciaisRef.current),
    )
  }, [])

  const salvarEdicao = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const dadosEdicao = obterDadosFormularioEdicao(evento.currentTarget)
    const mensagemValidacao = validarCadastroEdicao(dadosEdicao)

    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setMensagemErro(null)
    setModalConfirmacaoAberto(true)
  }

  const cancelarConfirmacaoSalvamento = useCallback(() => {
    setModalConfirmacaoAberto(false)
  }, [])

  async function submeterEdicao(form: HTMLFormElement) {
    if (!edicao || !idEdicao) return

    setMensagemErro(null)

    const dadosEdicao = obterDadosFormularioEdicao(form)
    const mensagemValidacao = validarCadastroEdicao(dadosEdicao)

    if (mensagemValidacao) {
      setMensagemErro(mensagemValidacao)
      return
    }

    setEstaSalvando(true)

    try {
      await atualizarEdicaoPrograma(idEdicao, dadosEdicao, {
        quantidadeInscritos: edicao.quantidadeInscritos,
        quantidadeAtendimentoEfetivo: edicao.quantidadeAtendimentoEfetivo,
        quantidadePasseios: edicao.quantidadePasseios,
        quantidadeApresentacoes: edicao.quantidadeApresentacoes,
      })

      navigate('/edicoes-programa')
    } catch (error) {
      if (error instanceof ErroAtualizacaoEdicaoPrograma) {
        setMensagemErro(error.mensagemUsuario)
      }
    } finally {
      setEstaSalvando(false)
    }
  }

  const confirmarSalvamento = () => {
    setModalConfirmacaoAberto(false)

    if (!formularioRef.current) return

    void submeterEdicao(formularioRef.current)
  }

  const camposNumericosDesabilitados = edicao
    ? montarCamposNumericosDesabilitados(edicao)
    : []

  return (
    <ContainerPagina>
      <MenuLateral />
      <SecaoPrincipal>
        <CabecalhoPagina />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoSecao
              titulo="Editar Edição do Programa"
              acoes={
                <BotaoVoltar
                  aria-label="Voltar para edições do programa"
                  onClick={voltarParaEdicoes}
                  icone={
                    <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  }
                >
                  Voltar
                </BotaoVoltar>
              }
            />

            {estaCarregando && (
              <IndicadorCarregamento mensagem="Carregando edição do programa..." />
            )}

            {!estaCarregando && mensagemErro && !edicao && (
              <MensagemAlerta variante="erro" role="alert">
                {mensagemErro}
              </MensagemAlerta>
            )}

            {edicao && (
              <CartaoFormulario
                ref={formularioRef}
                onSubmit={salvarEdicao}
                onChange={(evento) =>
                  detectarAlteracaoFormulario(evento.currentTarget)
                }
              >
                {mensagemErro && (
                  <MensagemAlerta variante="erro" role="alert">
                    {mensagemErro}
                  </MensagemAlerta>
                )}
                <CamposFormularioEditarEdicao
                  edicao={edicao}
                  camposNumericos={camposNumericosDesabilitados}
                />
                <AcoesFormulario>
                  <Botao
                    variante="contorno"
                    tamanho="formulario"
                    onClick={voltarParaEdicoes}
                  >
                    Cancelar
                  </Botao>
                  <Botao
                    variante="primario"
                    tamanho="formulario"
                    type="submit"
                    disabled={estaSalvando || !formularioAlterado}
                  >
                    Salvar
                  </Botao>
                </AcoesFormulario>
              </CartaoFormulario>
            )}

            <ModalConfirmacaoSalvarEdicaoPrograma
              aberto={modalConfirmacaoAberto}
              onConfirmar={confirmarSalvamento}
              onCancelar={cancelarConfirmacaoSalvamento}
            />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPagina>
  )
}
