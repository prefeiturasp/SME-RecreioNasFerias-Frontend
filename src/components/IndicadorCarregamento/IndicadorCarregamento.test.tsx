import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IndicadorCarregamento } from './index'

describe('IndicadorCarregamento', () => {
  it('exibe mensagem padrão de carregamento', () => {
    render(<IndicadorCarregamento />)

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('exibe mensagem personalizada', () => {
    render(<IndicadorCarregamento mensagem="Carregando opções..." />)

    expect(screen.getByText('Carregando opções...')).toBeInTheDocument()
  })
})
