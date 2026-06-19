import { Route, Routes } from 'react-router-dom'
import { RotaProtegida } from '../components/RotaProtegida'
import PaginaCadastrarNovaEdicaoPrograma from '../pages/PaginaCadastrarNovaEdicaoPrograma'
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
        path="/cadastrar-nova-edicao-programa"
        element={
          <RotaProtegida>
            <PaginaCadastrarNovaEdicaoPrograma />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}
