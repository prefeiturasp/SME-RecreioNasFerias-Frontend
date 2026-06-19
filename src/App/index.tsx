import { BrowserRouter } from 'react-router-dom'
import { VerificadorSessaoAutenticacao } from '../components/VerificadorSessaoAutenticacao'
import { ProvedorEstadoMenuLateral } from '../contexts/EstadoMenuLateralContext'
import { RotasAplicacao } from '../routes'
import { Layout } from './style'

export default function App() {
  return (
    <BrowserRouter>
      <VerificadorSessaoAutenticacao />
      <ProvedorEstadoMenuLateral>
        <Layout>
          <RotasAplicacao />
        </Layout>
      </ProvedorEstadoMenuLateral>
    </BrowserRouter>
  )
}
