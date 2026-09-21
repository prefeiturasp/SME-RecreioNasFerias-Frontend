import { BrowserRouter } from 'react-router-dom'
import { VerificadorSessaoAutenticacao } from '../components/VerificadorSessaoAutenticacao'
import { ProvedorEstadoMenuLateral } from '../contexts/EstadoMenuLateralContext'
import { RotasAplicacao } from '../routes'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/contexts/ToastContext'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <VerificadorSessaoAutenticacao />
        <ProvedorEstadoMenuLateral>
          <div className="flex h-full flex-col overflow-hidden">
            <RotasAplicacao />
          </div>
          <Toaster />
        </ProvedorEstadoMenuLateral>
      </ToastProvider>
    </BrowserRouter>
  )
}
