import { Route, Routes } from 'react-router-dom'
import { RotaProtegida } from '../components/RotaProtegida'
import { PERMISSOES } from '../services/autenticacao'
import PaginaDefinicoesPolo from '../pages/PaginaDefinicoesPolo'
import PaginaDetalhamentoDefinicaoPolo from '../pages/PaginaDetalhamentoDefinicaoPolo'
import PaginaPolosParceiros from '../pages/PaginaPolosParceiros'
import PaginaCadastrarNovaEdicaoPrograma from '../pages/PaginaCadastrarNovaEdicaoPrograma'
import PaginaInscricaoParticipantes from '../pages/PaginaInscricaoParticipantes'
import PaginaCadastrarParticipante from '../pages/PaginaCadastrarParticipante'
import PaginaCadastrarPoloParceiro from '../pages/PaginaCadastrarPoloParceiro'
import PaginaEditarPoloParceiro from '../pages/PaginaEditarPoloParceiro'
import PaginaEditarEdicaoPrograma from '../pages/PaginaEditarEdicaoPrograma'
import PaginaEdicoesPrograma from '../pages/PaginaEdicoesPrograma'
import PaginaInicial from '../pages/PaginaInicial'
import PaginaLogin from '../pages/PaginaLogin'

export function RotasAplicacao() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLogin />} />
      <Route
        path="/inicio"
        element={
          <RotaProtegida>
            <PaginaInicial />
          </RotaProtegida>
        }
      />
      <Route
        path="/edicoes-programa"
        element={
          <RotaProtegida permissao={PERMISSOES.visualizarEdicoes}>
            <PaginaEdicoesPrograma />
          </RotaProtegida>
        }
      />
      <Route
        path="/definicoes-polo"
        element={
          <RotaProtegida permissao={PERMISSOES.visualizarDefinicoesPolos}>
            <PaginaDefinicoesPolo />
          </RotaProtegida>
        }
      />
      <Route
        path="/definicoes-polo/polo/:poloUuid"
        element={
          <RotaProtegida permissao={PERMISSOES.visualizarDefinicoesPolos}>
            <PaginaDetalhamentoDefinicaoPolo />
          </RotaProtegida>
        }
      />
      <Route
        path="/definicoes-polo/:idDefinicao"
        element={
          <RotaProtegida permissao={PERMISSOES.visualizarDefinicoesPolos}>
            <PaginaDetalhamentoDefinicaoPolo />
          </RotaProtegida>
        }
      />
      <Route
        path="/polos-parceiros"
        element={
          <RotaProtegida permissao={PERMISSOES.visualizarPolos}>
            <PaginaPolosParceiros />
          </RotaProtegida>
        }
      />
      <Route
        path="/cadastrar-polo-parceiro"
        element={
          <RotaProtegida permissao={PERMISSOES.criarPolos}>
            <PaginaCadastrarPoloParceiro />
          </RotaProtegida>
        }
      />
      <Route
        path="/editar-polo-parceiro/:idPolo"
        element={
          <RotaProtegida permissao={PERMISSOES.editarPolos}>
            <PaginaEditarPoloParceiro />
          </RotaProtegida>
        }
      />
      <Route
        path="/cadastrar-nova-edicao-programa"
        element={
          <RotaProtegida permissao={PERMISSOES.criarEdicoes}>
            <PaginaCadastrarNovaEdicaoPrograma />
          </RotaProtegida>
        }
      />
      <Route
        path="/editar-edicao-programa/:idEdicao"
        element={
          <RotaProtegida permissao={PERMISSOES.editarEdicoes}>
            <PaginaEditarEdicaoPrograma />
          </RotaProtegida>
        }
      />
      <Route
        path="/cadastrar-participante"
        element={
          <RotaProtegida permissao={PERMISSOES.criarInscricoesParticipantes}>
            <PaginaCadastrarParticipante />
          </RotaProtegida>
        }
      />
      <Route
        path="/inscricoes-participantes"
        element={
          <RotaProtegida
            permissao={PERMISSOES.visualizarInscricoesParticipantes}
          >
            <PaginaInscricaoParticipantes />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}
