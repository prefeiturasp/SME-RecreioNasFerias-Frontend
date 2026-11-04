import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Cabecalho } from '@/components/Cabecalho'
import { MapaVisual } from '@/components/MapaVisual'
import { MenuLateral } from '@/components/MenuLateral'
import { useToast } from '@/hooks/useToast'

const MENSAGEM_ACESSO_NEGADO =
  'Você não tem permissão para acessar esta página.'

export default function PaginaInicial() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const mensagemAcessoNegado = (
    location.state as { mensagemAcessoNegado?: boolean } | null
  )?.mensagemAcessoNegado

  useEffect(() => {
    if (!mensagemAcessoNegado) return

    showToast({
      id: 'acesso-negado',
      description: MENSAGEM_ACESSO_NEGADO,
      variant: 'destructive',
    })
    navigate('/inicio', { replace: true })
  }, [mensagemAcessoNegado, navigate, showToast])

  return (
    <main className="flex h-full w-full overflow-hidden">
      <MenuLateral />

      <section className="flex h-screen min-w-0 flex-1 flex-col bg-main-background">
        <Cabecalho />

        <div className="min-h-0 flex-1 overflow-auto p-8 max-md:p-4">
          <MapaVisual niveis={[{ rotulo: 'Início' }]} />
        </div>
      </section>
    </main>
  )
}
