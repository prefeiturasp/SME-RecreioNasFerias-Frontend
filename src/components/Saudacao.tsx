import logoImg from '@/assets/logo-recreio.png'

export default function Saudacao() {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <p className="mb-6 text-lg">Bem-vindo(a) ao</p>
      <div className="flex flex-col items-center mb-5">
        <img src={logoImg} alt="Logo Recreio" className="w-40" />
      </div>
      <h3 className="text-[22px] font-semibold leading-snug">
        Sistema de Gestão
        <br />
        do Recreio nas Férias
      </h3>
    </div>
  )
}
