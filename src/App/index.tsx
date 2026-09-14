import { BrowserRouter } from 'react-router-dom'
import { VerificadorSessaoAutenticacao } from '../components/VerificadorSessaoAutenticacao'
import { ProvedorEstadoMenuLateral } from '../contexts/EstadoMenuLateralContext'
import { RotasAplicacao } from '../routes'

export default function App() {
  return (
    <BrowserRouter>
      <VerificadorSessaoAutenticacao />
      <ProvedorEstadoMenuLateral>
        <div className="flex h-full flex-col overflow-hidden">
          <RotasAplicacao />
        </div>
      </ProvedorEstadoMenuLateral>
    </BrowserRouter>
  )
}
