import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  definirSessaoAutenticacao,
  limparSessaoAutenticacao,
  PERMISSOES,
} from '@/services/autenticacao'
import { usePermissoesUsuario } from './usePermissoesUsuario'

function ConsultaPermissao({ codigo }: { codigo: string }) {
  const { possuiPermissao } = usePermissoesUsuario()

  return <output>{possuiPermissao(codigo) ? 'permitido' : 'negado'}</output>
}

function definirSessao(permissoes: string[]) {
  definirSessaoAutenticacao({
    token: 'eyJ-token',
    rf: '1234567',
    nome: 'USUARIO TESTE',
    descricaoCargo: 'CARGO TESTE',
    perfis: [],
    permissoes,
  })
}

describe('usePermissoesUsuario', () => {
  beforeEach(() => {
    limparSessaoAutenticacao()
  })

  it('confirma o código presente na sessão', () => {
    definirSessao([PERMISSOES.visualizarEdicoes])

    render(<ConsultaPermissao codigo={PERMISSOES.visualizarEdicoes} />)

    expect(screen.getByText('permitido')).toBeInTheDocument()
  })

  it('nega um código que a sessão não tem', () => {
    definirSessao([PERMISSOES.visualizarInscricoesParticipantes])

    render(<ConsultaPermissao codigo={PERMISSOES.visualizarEdicoes} />)

    expect(screen.getByText('negado')).toBeInTheDocument()
  })

  it('nega qualquer código quando não há sessão', () => {
    render(<ConsultaPermissao codigo={PERMISSOES.visualizarEdicoes} />)

    expect(screen.getByText('negado')).toBeInTheDocument()
  })
})
