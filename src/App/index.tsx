import { BrowserRouter } from 'react-router-dom'
import { VerificadorSessaoAutenticacao } from '../components/VerificadorSessaoAutenticacao'
import { ProvedorEstadoMenuLateral } from '../contexts/EstadoMenuLateralContext'
import { RotasAplicacao } from '../routes'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/contexts/ToastContext'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ToastProvider>
          <VerificadorSessaoAutenticacao />
          <ProvedorEstadoMenuLateral>
            <div className="flex h-full flex-col overflow-hidden">
              <RotasAplicacao />
            </div>
            <Toaster />
          </ProvedorEstadoMenuLateral>
        </ToastProvider>
      </TooltipProvider>
    </BrowserRouter>
  )
}
