import { Route, Routes } from 'react-router-dom'
import { RotaProtegida } from '../components/RotaProtegida'
import PaginaDefinicoesPolo from '../pages/PaginaDefinicoesPolo'
import PaginaPolosParceiros from '../pages/PaginaPolosParceiros'
import PaginaCadastrarNovaEdicaoPrograma from '../pages/PaginaCadastrarNovaEdicaoPrograma'
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
          <RotaProtegida>
            <PaginaEdicoesPrograma />
          </RotaProtegida>
        }
      />
      <Route
        path="/definicoes-polo"
        element={
          <RotaProtegida>
            <PaginaDefinicoesPolo />
          </RotaProtegida>
        }
      />
      <Route
        path="/polos-parceiros"
        element={
          <RotaProtegida>
            <PaginaPolosParceiros />
          </RotaProtegida>
        }
      />
      <Route
        path="/cadastrar-polo-parceiro"
        element={
          <RotaProtegida>
            <PaginaCadastrarPoloParceiro />
          </RotaProtegida>
        }
      />
      <Route
        path="/editar-polo-parceiro/:idPolo"
        element={
          <RotaProtegida>
            <PaginaEditarPoloParceiro />
          </RotaProtegida>
        }
      />
      <Route
        path="/cadastrar-nova-edicao-programa"
        element={
          <RotaProtegida>
            <PaginaCadastrarNovaEdicaoPrograma />
          </RotaProtegida>
        }
      />
      <Route
        path="/editar-edicao-programa/:idEdicao"
        element={
          <RotaProtegida>
            <PaginaEditarEdicaoPrograma />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}
