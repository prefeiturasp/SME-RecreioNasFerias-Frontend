import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import IconeSetaVoltar from '../../assets/icone-seta-voltar.png'
import { Cabecalho } from '../../components/Cabecalho'
import { GrupoPeriodoData } from '../../components/CampoDataFormulario'
import { MapaVisual } from '../../components/MapaVisual'
import { MenuLateral } from '../../components/MenuLateral'
import {
  atualizarEdicaoPrograma,
  ErroAtualizacaoEdicaoPrograma,
  ErroObterEdicaoPrograma,
  obterEdicaoPrograma,
} from '../../services/edicaoPrograma/api'
import type { EdicaoPrograma } from '../../services/edicaoPrograma/types'
import { validarCadastroEdicao } from '../../services/edicaoPrograma/validarCadastroEdicao'
import { ModalConfirmacaoSalvarEdicaoPrograma } from './ModalConfirmacaoSalvarEdicaoPrograma'
import {
  AreaConteudo,
  BotaoCancelarFormulario,
  BotaoSalvarFormulario,
  BotaoVoltar,
  CabecalhoAreaInternaConteudo,
  ContainerPaginaEdicoesPrograma,
  FormularioCadastroNovaEdicao,
  InputNumericoFormularioCadastroNovaEdicao,
  InputTextoFormularioCadastroNovaEdicao,
  LinhaDeControlesFormularioCadastroNovaEdicao,
  LinhaFormularioCadastroNovaEdicao,
  MensagemErroFormulario,
  RotuloBotaoVoltar,
  SecaoPrincipal,
} from './style'

const NIVEIS_MAPA_VISUAL = [
  { rotulo: 'Início', caminho: '/inicio' },
  { rotulo: 'Cadastros' },
  { rotulo: 'Edições do programa', caminho: '/edicoes-programa' },
  { rotulo: 'Editar Edição do Programa' },
] as const

function obterCampoTextoFormulario(dados: FormData, nomeCampo: string): string {
  const valor = dados.get(nomeCampo)
  return typeof valor === 'string' ? valor : ''
}

type DadosEditaveisEdicao = {
  nome: string
  dataInicioEdicao: string
  dataFimEdicao: string
  dataInicioInscricoes: string
  dataFimInscricoes: string
}

function obterDadosEditaveisFormulario(
  form: HTMLFormElement,
): DadosEditaveisEdicao {
  const dados = new FormData(form)

  return {
    nome: obterCampoTextoFormulario(dados, 'NomeDaEdicao'),
    dataInicioEdicao: obterCampoTextoFormulario(dados, 'DataInicioEdicao'),
    dataFimEdicao: obterCampoTextoFormulario(dados, 'DataFimEdicao'),
    dataInicioInscricoes: obterCampoTextoFormulario(
      dados,
      'DataInicioInscricoes',
    ),
    dataFimInscricoes: obterCampoTextoFormulario(dados, 'DataFimInscricoes'),
  }
}

function dadosEditaveisSaoIguais(
  atual: DadosEditaveisEdicao,
  inicial: DadosEditaveisEdicao,
): boolean {
  return (
    atual.nome === inicial.nome &&
    atual.dataInicioEdicao === inicial.dataInicioEdicao &&
    atual.dataFimEdicao === inicial.dataFimEdicao &&
    atual.dataInicioInscricoes === inicial.dataInicioInscricoes &&
    atual.dataFimInscricoes === inicial.dataFimInscricoes
  )
}

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

export default function PaginaEditarEdicaoPrograma() {
  const navigate = useNavigate()
  const { idEdicao } = useParams<{ idEdicao: string }>()
  const [edicao, setEdicao] = useState<EdicaoPrograma | null>(null)
  const [estaCarregando, setEstaCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [estaSalvando, setEstaSalvando] = useState(false)
  const [formularioAlterado, setFormularioAlterado] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const valoresIniciaisRef = useRef<DadosEditaveisEdicao | null>(null)
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
      .then((edicaoCarregada) => {
        setEdicao(edicaoCarregada)
      })
      .catch((error) => {
        setEdicao(null)

        if (error instanceof ErroObterEdicaoPrograma) {
          setMensagemErro(error.mensagemUsuario)
          return
        }

        setMensagemErro('Não foi possível carregar a edição do programa.')
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

    valoresIniciaisRef.current = {
      nome: edicao.nome,
      dataInicioEdicao: edicao.dataInicioEdicao,
      dataFimEdicao: edicao.dataFimEdicao,
      dataInicioInscricoes: edicao.dataInicioInscricoes,
      dataFimInscricoes: edicao.dataFimInscricoes,
    }
    setFormularioAlterado(false)
  }, [edicao])

  const detectarAlteracaoFormulario = useCallback(
    (form: HTMLFormElement) => {
      if (!valoresIniciaisRef.current) return

      const dadosAtuais = obterDadosEditaveisFormulario(form)
      setFormularioAlterado(
        !dadosEditaveisSaoIguais(dadosAtuais, valoresIniciaisRef.current),
      )
    },
    [],
  )

  const salvarEdicao = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const dadosEdicao = obterDadosEditaveisFormulario(evento.currentTarget)
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

  const confirmarSalvamento = () => {
    setModalConfirmacaoAberto(false)

    if (!formularioRef.current) return

    void submeterEdicao(formularioRef.current)
  }

  async function submeterEdicao(form: HTMLFormElement) {
    if (!edicao || !idEdicao) return

    setMensagemErro(null)

    const dadosEdicao = obterDadosEditaveisFormulario(form)

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

  const camposNumericosDesabilitados = edicao
    ? montarCamposNumericosDesabilitados(edicao)
    : []

  return (
    <ContainerPaginaEdicoesPrograma>
      <MenuLateral />
      <SecaoPrincipal>
        <Cabecalho />
        <AreaConteudo>
          <MapaVisual niveis={[...NIVEIS_MAPA_VISUAL]} />
          <section>
            <CabecalhoAreaInternaConteudo>
              <h3>Editar Edição do Programa</h3>
              <div>
                <BotaoVoltar
                  type="button"
                  aria-label="Voltar para edições do programa"
                  onClick={voltarParaEdicoes}
                >
                  <img src={IconeSetaVoltar} alt="" aria-hidden="true" />
                  <RotuloBotaoVoltar>Voltar</RotuloBotaoVoltar>
                </BotaoVoltar>
              </div>
            </CabecalhoAreaInternaConteudo>

            {estaCarregando && (
              <output>Carregando edição do programa...</output>
            )}

            {!estaCarregando && mensagemErro && !edicao && (
              <MensagemErroFormulario role="alert">
                {mensagemErro}
              </MensagemErroFormulario>
            )}

            {edicao && (
              <FormularioCadastroNovaEdicao
                ref={formularioRef}
                onSubmit={salvarEdicao}
                onChange={(evento) =>
                  detectarAlteracaoFormulario(evento.currentTarget)
                }
              >
                {mensagemErro && (
                  <MensagemErroFormulario role="alert">
                    {mensagemErro}
                  </MensagemErroFormulario>
                )}
                <LinhaFormularioCadastroNovaEdicao>
                  <InputTextoFormularioCadastroNovaEdicao>
                    <label htmlFor="NomeDaEdicao">Nome da Edição</label>
                    <input
                      type="text"
                      name="NomeDaEdicao"
                      id="NomeDaEdicao"
                      placeholder="Digite o Nome da Edição"
                      defaultValue={edicao.nome}
                    />
                  </InputTextoFormularioCadastroNovaEdicao>
                  <GrupoPeriodoData
                    rotulo="Período da Edição"
                    idCampoInicio="DataInicioEdicao"
                    nomeCampoInicio="DataInicioEdicao"
                    rotuloAcessivelInicio="Data de início da edição"
                    idCampoFim="DataFimEdicao"
                    nomeCampoFim="DataFimEdicao"
                    rotuloAcessivelFim="Data de fim da edição"
                    valorCampoInicio={edicao.dataInicioEdicao}
                    valorCampoFim={edicao.dataFimEdicao}
                  />
                  <GrupoPeriodoData
                    rotulo="Período das Inscrições"
                    idCampoInicio="DataInicioInscricoes"
                    nomeCampoInicio="DataInicioInscricoes"
                    rotuloAcessivelInicio="Data de início das inscrições"
                    idCampoFim="DataFimInscricoes"
                    nomeCampoFim="DataFimInscricoes"
                    rotuloAcessivelFim="Data de fim das inscrições"
                    valorCampoInicio={edicao.dataInicioInscricoes}
                    valorCampoFim={edicao.dataFimInscricoes}
                  />
                </LinhaFormularioCadastroNovaEdicao>

                <LinhaFormularioCadastroNovaEdicao>
                  {camposNumericosDesabilitados.slice(0, 3).map((campo) => (
                    <InputNumericoFormularioCadastroNovaEdicao key={campo.id}>
                      <label htmlFor={campo.id}>{campo.rotulo}</label>
                      <input
                        type="number"
                        name={campo.id}
                        id={campo.id}
                        placeholder={campo.placeholder}
                        readOnly
                        value={campo.valor}
                      />
                    </InputNumericoFormularioCadastroNovaEdicao>
                  ))}
                </LinhaFormularioCadastroNovaEdicao>

                <LinhaFormularioCadastroNovaEdicao>
                  <InputNumericoFormularioCadastroNovaEdicao>
                    <label htmlFor={camposNumericosDesabilitados[3].id}>
                      {camposNumericosDesabilitados[3].rotulo}
                    </label>
                    <input
                      type="number"
                      name={camposNumericosDesabilitados[3].id}
                      id={camposNumericosDesabilitados[3].id}
                      placeholder={camposNumericosDesabilitados[3].placeholder}
                      readOnly
                      value={camposNumericosDesabilitados[3].valor}
                    />
                  </InputNumericoFormularioCadastroNovaEdicao>
                </LinhaFormularioCadastroNovaEdicao>

                <LinhaDeControlesFormularioCadastroNovaEdicao>
                  <BotaoCancelarFormulario
                    type="button"
                    onClick={voltarParaEdicoes}
                  >
                    Cancelar
                  </BotaoCancelarFormulario>
                  <BotaoSalvarFormulario
                    type="submit"
                    disabled={estaSalvando || !formularioAlterado}
                  >
                    Salvar
                  </BotaoSalvarFormulario>
                </LinhaDeControlesFormularioCadastroNovaEdicao>
              </FormularioCadastroNovaEdicao>
            )}

            <ModalConfirmacaoSalvarEdicaoPrograma
              aberto={modalConfirmacaoAberto}
              onConfirmar={confirmarSalvamento}
              onCancelar={cancelarConfirmacaoSalvamento}
            />
          </section>
        </AreaConteudo>
      </SecaoPrincipal>
    </ContainerPaginaEdicoesPrograma>
  )
}
