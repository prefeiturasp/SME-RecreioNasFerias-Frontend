import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { grupoExigeEstudanteDaRede, TIPO_ESTUDANTE_REDE } from './constantes'
import { InformacoesBasicas } from './InformacoesBasicas'
import { SecaoFormulario } from './SecaoFormulario'
import type { FormValues } from './schema'
import formSchema from './schema'

import { BlocoTexto } from '@/components/BlocoTexto'
import { AlertaErroApi } from '@/components/AlertaErroApi'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useGetDres } from '@/hooks/useGetDres'
import { useGetParticipanteCpf } from '@/hooks/useGetParticipanteCpf'
import { useGetParticipanteEol } from '@/hooks/useGetParticipanteEol'
import { useGetInscricao } from '@/hooks/useGetInscricao'
import { useGetPolosElegiveis } from '@/hooks/useGetPolosElegiveis'
import { useGetValoresChoices } from '@/hooks/useGetValoresChoices'
import { usePostInscricao } from '@/hooks/usePostInscricao'
import { usePutInscricao } from '@/hooks/usePutInscricao'
import { useToast } from '@/hooks/useToast'
import type { ParticipanteEol } from '@/services/inscricao/types'
import { extrairDigitos } from '@/utils/mascarasEntrada'

function impedirBlurAntesDoClique(evento: MouseEvent<HTMLButtonElement>) {
  evento.preventDefault()
}

const CAMPOS_DO_PARTICIPANTE_VAZIOS = {
  nomeCompleto: '',
  dataNascimento: '',
  nomeResponsavel: '',
  nomeSocialResponsavel: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  telefone1: '',
  telefone2: '',
  email: '',
}

export function ParticipanteForm({
  inscricaoUuid,
}: {
  inscricaoUuid?: string
}) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const cadastroMutation = usePostInscricao()
  const inscricaoQuery = useGetInscricao(inscricaoUuid)
  const edicaoMutation = usePutInscricao(inscricaoUuid)
  const mutation = inscricaoUuid ? edicaoMutation : cadastroMutation
  const buscaVigente = useRef<'codigoEol' | 'cpf' | null>(null)
  const [codigoEolConsulta, setCodigoEolConsulta] = useState<string>()
  const [cpfConsulta, setCpfConsulta] = useState<string>()
  const consultaParticipante = useGetParticipanteEol(codigoEolConsulta)
  const consultaCpf = useGetParticipanteCpf(cpfConsulta)
  const [origemConsulta, setOrigemConsulta] = useState<
    'codigoEol' | 'cpf' | null
  >(null)
  const [codigoEolSincronizado, setCodigoEolSincronizado] = useState<
    string | null
  >(null)
  const [cpfSincronizado, setCpfSincronizado] = useState<string | null>(null)
  const eolDesabilitado = useMemo(
    () => origemConsulta === 'cpf',
    [origemConsulta],
  )
  const cpfDesabilitado = useMemo(
    () => origemConsulta === 'codigoEol',
    [origemConsulta],
  )
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grupo: '',
      tipoEstudante: '',
      codigoEol: '',
      cpf: '',
      nomeCompleto: '',
      dataNascimento: '',
      nomeResponsavel: '',
      nomeSocialResponsavel: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      telefone1: '',
      telefone2: '',
      email: '',
      dreCodigoEol: '',
      polo: '',
    },
  })
  useEffect(() => {
    const inscricao = inscricaoQuery.data
    if (!inscricao) return

    form.reset({
      grupo: inscricao.grupo,
      tipoEstudante: inscricao.tipo_estudante,
      codigoEol: inscricao.codigo_eol,
      cpf: extrairDigitos(inscricao.cpf),
      nomeCompleto: inscricao.nome_participante,
      dataNascimento: inscricao.data_nascimento ?? '',
      nomeResponsavel: inscricao.responsavel_nome,
      nomeSocialResponsavel: inscricao.responsavel_nome_social,
      cep: inscricao.cep,
      logradouro: inscricao.logradouro,
      numero: inscricao.numero,
      complemento: inscricao.complemento,
      bairro: inscricao.bairro,
      cidade: inscricao.cidade,
      telefone1: inscricao.telefone_contato_1,
      telefone2: inscricao.telefone_contato_2,
      email: inscricao.email,
      dreCodigoEol: inscricao.dre_codigo_eol,
      polo: inscricao.polo?.uuid ?? '',
    })
  }, [form, inscricaoQuery.data])
  const [grupo, tipoEstudante, dreCodigoEol] = useWatch({
    control: form.control,
    name: ['grupo', 'tipoEstudante', 'dreCodigoEol'],
  })
  const dresQuery = useGetDres()
  const polosQuery = useGetPolosElegiveis(dreCodigoEol)
  const choicesQuery = useGetValoresChoices()
  const dres = useMemo(() => dresQuery.data ?? [], [dresQuery.data])
  const polos = useMemo(() => polosQuery.data ?? [], [polosQuery.data])
  const tiposEstudante = useMemo(
    () => choicesQuery.data?.tipo_estudante ?? [],
    [choicesQuery.data?.tipo_estudante],
  )
  const grupos = useMemo(
    () => choicesQuery.data?.grupo_inscricao ?? [],
    [choicesQuery.data?.grupo_inscricao],
  )
  const tipoTravado = useMemo(() => grupoExigeEstudanteDaRede(grupo), [grupo])
  const camposLiberados = useMemo(
    () => Boolean(grupo) && Boolean(tipoEstudante),
    [grupo, tipoEstudante],
  )

  function aoMudarGrupo(valor: string) {
    form.setValue(
      'tipoEstudante',
      grupoExigeEstudanteDaRede(valor) ? TIPO_ESTUDANTE_REDE : '',
    )
  }

  function aoMudarDre() {
    form.setValue('polo', '')
  }

  function limparCamposDoParticipante(
    codigoEol = form.getValues('codigoEol'),
    cpf = form.getValues('cpf'),
  ) {
    form.reset({
      ...form.getValues(),
      ...CAMPOS_DO_PARTICIPANTE_VAZIOS,
      codigoEol,
      cpf,
    })
    setCodigoEolSincronizado(null)
    setCpfSincronizado(null)
  }

  function preencherComParticipante(
    participante: ParticipanteEol,
    cpf = form.getValues('cpf'),
  ) {
    const codigoEol =
      origemConsulta === 'cpf'
        ? form.getValues('codigoEol')
        : participante.codigo_eol

    form.reset({
      ...form.getValues(),
      codigoEol,
      cpf,
      nomeCompleto: participante.nome_participante,
      dataNascimento: participante.data_nascimento,
      nomeResponsavel: participante.responsavel_nome,
      nomeSocialResponsavel: participante.responsavel_nome_social,
      cep: participante.cep,
      logradouro: participante.logradouro,
      numero: participante.numero,
      complemento: participante.complemento,
      bairro: participante.bairro,
      cidade: participante.cidade,
      telefone1: participante.telefone_contato_1,
      telefone2: participante.telefone_contato_2,
      email: participante.email,
    })
    setCodigoEolSincronizado(origemConsulta === 'cpf' ? null : codigoEol)
  }

  function consultaAindaVale(origem: 'codigoEol' | 'cpf', valor: string) {
    return buscaVigente.current === origem && form.getValues(origem) === valor
  }

  function consultarParticipante(codigoEol: string) {
    if (!codigoEol) return

    buscaVigente.current = 'codigoEol'
    setCpfConsulta(undefined)

    if (codigoEol === codigoEolConsulta) {
      if (consultaParticipante.fetchStatus !== 'fetching') {
        void consultaParticipante.refetch().catch(() => undefined)
      }
      return
    }

    setCodigoEolConsulta(codigoEol)
  }

  function consultarPorCpf(cpf: string) {
    if (!cpf) return

    buscaVigente.current = 'cpf'
    setCodigoEolConsulta(undefined)

    if (cpf === cpfConsulta) {
      if (consultaCpf.fetchStatus !== 'fetching') {
        void consultaCpf.refetch().catch(() => undefined)
      }
      return
    }

    setCpfConsulta(cpf)
  }

  function aoMudarCodigoEol(valor: string) {
    if (origemConsulta === 'cpf') return

    if (valor) {
      setOrigemConsulta('codigoEol')
    } else if (origemConsulta === 'codigoEol') {
      setOrigemConsulta(null)
    }

    const codigoAlteradoAposConsulta =
      codigoEolSincronizado !== null && valor !== codigoEolSincronizado

    if (codigoAlteradoAposConsulta) {
      limparCamposDoParticipante(valor, '')
      setCodigoEolConsulta(undefined)
      return
    }

    if (consultaParticipante.error) {
      setCodigoEolConsulta(undefined)
    }
  }

  function aoMudarCpf(valor: string) {
    if (origemConsulta === 'codigoEol') return

    if (valor) {
      setOrigemConsulta('cpf')
    } else if (origemConsulta === 'cpf') {
      setOrigemConsulta(null)
    }

    const cpfAlteradoAposConsulta =
      cpfSincronizado !== null && valor !== cpfSincronizado

    if (cpfAlteradoAposConsulta) {
      limparCamposDoParticipante('', valor)
      setCpfConsulta(undefined)
      return
    }

    if (consultaCpf.error) {
      setCpfConsulta(undefined)
    }
  }

  useEffect(() => {
    if (!codigoEolConsulta || buscaVigente.current !== 'codigoEol') return
    if (consultaParticipante.isFetching) return
    if (!consultaAindaVale('codigoEol', codigoEolConsulta)) return

    if (consultaParticipante.isError) {
      limparCamposDoParticipante(codigoEolConsulta, '')
      return
    }

    if (!consultaParticipante.data) return

    preencherComParticipante(consultaParticipante.data, form.getValues('cpf'))
    setCpfSincronizado(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- as funções só usam form e setters estáveis; incluí-las reexecutaria o efeito a cada render
  }, [
    codigoEolConsulta,
    consultaParticipante.data,
    consultaParticipante.dataUpdatedAt,
    consultaParticipante.errorUpdatedAt,
    consultaParticipante.isFetching,
    consultaParticipante.isError,
  ])

  useEffect(() => {
    if (!cpfConsulta || buscaVigente.current !== 'cpf') return
    if (consultaCpf.isFetching) return
    if (!consultaAindaVale('cpf', cpfConsulta)) return

    if (consultaCpf.isError) {
      limparCamposDoParticipante('', cpfConsulta)
      return
    }

    if (!consultaCpf.data) return

    preencherComParticipante(consultaCpf.data, cpfConsulta)
    setCpfSincronizado(cpfConsulta)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- as funções só usam form e setters estáveis; incluí-las reexecutaria o efeito a cada render
  }, [
    cpfConsulta,
    consultaCpf.data,
    consultaCpf.dataUpdatedAt,
    consultaCpf.errorUpdatedAt,
    consultaCpf.isFetching,
    consultaCpf.isError,
  ])

  function salvar(dados: FormValues) {
    if (mutation.isError) mutation.reset()

    const dreNome =
      dres.find((dre) => dre.codigo_dre === dados.dreCodigoEol)?.nome_dre ?? ''

    mutation.mutate(
      {
        ...dados,
        dreNome,
      },
      {
        onSuccess: (inscricao) => {
          showToast({
            id: 'inscricao-salva',
            description: inscricao.status_label,
          })
          navigate('/inscricoes-participantes')
        },
      },
    )
  }

  if (inscricaoUuid && inscricaoQuery.isLoading) {
    return <p role="status">Carregando inscrição...</p>
  }

  if (inscricaoUuid && inscricaoQuery.isError) {
    return <AlertaErroApi erro={inscricaoQuery.error} />
  }

  return (
    <form
      noValidate
      aria-label={`Formulário de ${inscricaoUuid ? 'edição' : 'cadastro'} de participante`}
      onSubmit={form.handleSubmit(salvar)}
      className="rounded-sm bg-background p-8 shadow-card max-md:p-4"
    >
      <FieldGroup className="gap-8">
        <BlocoTexto>
          Usuário deve visualizar texto com orientações que precisa compartilhar
          com familiares e responsáveis.
        </BlocoTexto>

        <div className="flex flex-col gap-4">
          <SecaoFormulario titulo="Informações Básicas" aberta>
            <InformacoesBasicas
              control={form.control}
              grupo={grupo}
              tipoTravado={tipoTravado}
              camposLiberados={camposLiberados}
              tipoEstudante={tipoEstudante}
              dreCodigoEol={dreCodigoEol}
              dres={dres}
              polos={polos}
              tiposEstudante={tiposEstudante}
              grupos={grupos}
              erro={
                consultaCpf.error ??
                consultaParticipante.error ??
                mutation.error ??
                dresQuery.error ??
                polosQuery.error ??
                choicesQuery.error
              }
              consultandoCodigoEol={consultaParticipante.isFetching}
              consultandoCpf={consultaCpf.isFetching}
              onBuscarCodigoEol={consultarParticipante}
              aoMudarCodigoEol={aoMudarCodigoEol}
              onBuscarCpf={consultarPorCpf}
              aoMudarCpf={aoMudarCpf}
              aoMudarGrupo={aoMudarGrupo}
              aoMudarDre={aoMudarDre}
              eolDesabilitado={eolDesabilitado}
              cpfDesabilitado={cpfDesabilitado}
              modoEdicao={Boolean(inscricaoUuid)}
              poloNome={inscricaoQuery.data?.polo?.nome_polo}
            />
          </SecaoFormulario>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 max-md:flex-col-reverse max-md:[&>button]:w-full">
          <Button
            type="button"
            variant="outline"
            className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
            onClick={() => navigate('/inscricoes-participantes')}
          >
            Cancelar
          </Button>

          {!inscricaoUuid && (
            <Button
              type="submit"
              variant="outline"
              disabled={mutation.isPending}
              className="h-9.5 rounded-sm border-brand-dark px-4 font-bold text-brand-dark hover:bg-accent hover:text-brand-dark"
              onMouseDown={impedirBlurAntesDoClique}
            >
              Salvar Rascunho
            </Button>
          )}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-9.5 rounded-sm bg-brand-dark px-4 font-bold text-background hover:bg-brand-dark-hover disabled:bg-button-primary-disabled-bg disabled:opacity-100"
            onMouseDown={impedirBlurAntesDoClique}
          >
            Salvar
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
