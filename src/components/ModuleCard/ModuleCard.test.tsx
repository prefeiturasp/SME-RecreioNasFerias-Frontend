import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ModuleCard } from './index'

describe('ModuleCard', () => {
  it('renderiza o card com nome e ícone', () => {
    render(
      <ModuleCard
        nome="Cronogramas"
        icone={<svg aria-hidden="true"><title>icone</title></svg>}
      />,
    )

    expect(screen.getByRole('button', { name: /cronogramas/i })).toBeInTheDocument()
    expect(screen.getByText(/cronogramas/i)).toBeInTheDocument()
  })
})
