import { LoginForm } from '@/components/login/LoginForm'
import Banner from '@/components/Banner'
import Saudacao from '@/components/Saudacao'
import LogoPrefeitura from '@/components/LogoPrefeitura'

export default function PaginaLogin() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-x-hidden">
      <div className="w-full md:w-[60%] shrink-0">
        <Banner />
      </div>

      <div className="w-full md:w-[40%] flex flex-col bg-white overflow-y-auto justify-center">
        <div className="w-full flex flex-col items-center shrink-0 px-4 py-8">
          <Saudacao />
          <LoginForm />
          <LogoPrefeitura />
        </div>
      </div>
    </div>
  )
}
