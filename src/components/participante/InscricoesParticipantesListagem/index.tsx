import type { DefinicaoColuna } from '@/components/TabelaListagem/types'
import useGetInscricoes from '@/hooks/useGetInscricoes'
import { useInscricoesParticipantesStore } from '@/stores/useInscricoesParticipantesStore'
import { useShallow } from 'zustand/react/shallow'
import { TabelaListagem } from '@/components/TabelaListagem'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { iconeLapisEditar } from '@/assets/'
import type { InscricaoApi } from '@/services/inscricao/types'

const COLUNAS = [
  {
    id: 'tipo_estudante',
    rotulo: 'Tipo de Estudante',
    valorOrdenacao: (inscricao) => inscricao.tipo_estudante ?? '',
    renderizar: (inscricao) => inscricao.tipo_estudante_label,
  },
  {
    id: 'polo',
    rotulo: 'Polo de Inscrição',
    valorOrdenacao: (inscricao) => inscricao.polo_nome ?? inscricao.polo ?? '',
    renderizar: (inscricao) => inscricao.polo_nome ?? inscricao.polo ?? '-',
  },
  {
    id: 'codigo_eol',
    rotulo: 'Código EOL',
    valorOrdenacao: (inscricao) => inscricao.codigo_eol ?? 0,
    renderizar: (inscricao) => inscricao.codigo_eol ?? '-',
  },
  {
    id: 'cpf',
    rotulo: 'CPF',
    valorOrdenacao: (inscricao) => inscricao.cpf ?? '',
    renderizar: (inscricao) => inscricao.cpf ?? '-',
  },
  {
    id: 'nome_participante',
    rotulo: 'Nome do Participante',
    valorOrdenacao: (inscricao) => inscricao.nome_participante ?? '',
    renderizar: (inscricao) => inscricao.nome_participante ?? '-',
  },
  {
    id: 'grupo',
    rotulo: 'Agrupamento',
    valorOrdenacao: (inscricao) => inscricao.grupo ?? '',
    renderizar: (inscricao) => inscricao.grupo_label ?? '-',
  },
  {
    id: 'status',
    rotulo: 'Status',
    valorOrdenacao: (inscricao) => inscricao.status ?? '',
    renderizar: (inscricao) => inscricao.status_label ?? '-',
  },
] as const satisfies readonly DefinicaoColuna<InscricaoApi>[]

export function InscricoesParticipantesListagem() {
  const inscricoesQuery = useGetInscricoes()

  const { paginaAtual, itensPorPagina, setPaginaAtual, setItensPorPagina } =
    useInscricoesParticipantesStore(
      useShallow((estado) => ({
        paginaAtual: estado.paginaAtual,
        itensPorPagina: estado.itensPorPagina,
        setPaginaAtual: estado.setPaginaAtual,
        setItensPorPagina: estado.setItensPorPagina,
      })),
    )

  const resposta = inscricoesQuery.data
  const inscricoes = Array.isArray(resposta)
    ? resposta
    : (resposta?.results ?? [])

  const totalPaginas = Math.ceil(
    (Array.isArray(resposta) ? resposta.length : (resposta?.count ?? 0)) /
      itensPorPagina,
  )

  function mudarItensPorPagina(novoTamanho: number) {
    setItensPorPagina(novoTamanho)
    setPaginaAtual(1)
  }

  return (
    <>
      <h4 id="secao-listagem" className="font-bold text-primary mt-3">
        Listagem de Participantes
      </h4>

      <TabelaListagem
        itens={inscricoes}
        colunas={COLUNAS}
        obterId={(item) => item.uuid}
        colunaOrdenacaoInicial="nome_participante"
        modoPaginacao="servidor"
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        itensPorPagina={itensPorPagina}
        onMudarPagina={setPaginaAtual}
        onMudarItensPorPagina={mudarItensPorPagina}
        rotuloAcessivelPaginacao="Paginação das inscrições dos participantes"
        renderizarAcoes={(inscricao) => (
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="text-brand-dark"
          >
            <Link
              to={`/editar-participante/${inscricao.uuid}`}
              aria-label={`Editar inscrição ${inscricao.nome_participante}`}
            >
              <img
                src={iconeLapisEditar}
                alt=""
                aria-hidden="true"
                className="size-5"
              />
            </Link>
          </Button>
        )}
      />
    </>
  )
}
