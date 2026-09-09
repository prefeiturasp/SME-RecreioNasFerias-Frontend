import { Link, useNavigate } from 'react-router-dom'
import logoRecreioImg from '@/assets/logo-recreio.png'
import { IconeSair } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  encerrarSessaoAutenticacao,
  obterSessaoAutenticacao,
} from '@/services/autenticacao'

export function Cabecalho() {
  const navigate = useNavigate()
  const session = obterSessaoAutenticacao()

  async function handleLogout() {
    await encerrarSessaoAutenticacao()
    navigate('/')
  }

  return (
    <header className="flex h-29.5 w-full shrink-0 items-center justify-between bg-background px-8 py-2.5 shadow-header">
      <Link
        to="/inicio"
        aria-label="Voltar ao início"
        className="block leading-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <img
          src={logoRecreioImg}
          alt=""
          aria-hidden="true"
          className="h-19.25 w-34.25"
        />
      </Link>

      <div className="flex items-center gap-5.5">
        <div className="min-w-51.5 rounded-sm border border-user-card-border bg-main-background p-2.5 text-xs font-normal text-foreground">
          <p>RF: {session?.rf ?? ''}</p>
          <p>{session?.nome ?? ''}</p>
          <p>{session?.descricaoCargo ?? ''}</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          aria-label="Sair"
          className="h-auto flex-col gap-0 rounded-sm px-0 py-0 hover:bg-transparent hover:text-inherit"
          onClick={handleLogout}
        >
          <span className="flex size-10.5 items-center justify-center rounded-full bg-primary text-background">
            <IconeSair />
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            Sair
          </span>
        </Button>
      </div>
    </header>
  )
}
