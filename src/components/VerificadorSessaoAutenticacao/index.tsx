import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { registrarOuvinteSessaoInvalida } from '../../services/autenticacao/sessaoInvalida'
import {
  deveVerificarSessaoNaRota,
  verificarSessaoAtiva,
} from '../../services/autenticacao/verificarSessaoAtiva'

export function VerificadorSessaoAutenticacao() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    return registrarOuvinteSessaoInvalida(() => {
      navigate('/', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    if (!deveVerificarSessaoNaRota(location.pathname)) return

    void verificarSessaoAtiva().then((sessaoValida) => {
      if (!sessaoValida) {
        navigate('/', { replace: true })
      }
    })
  }, [location.pathname, navigate])

  return null
}
