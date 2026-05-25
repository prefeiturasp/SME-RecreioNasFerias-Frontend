import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Layout } from './style'

describe('App styles', () => {
  it('renderiza o Layout', () => {
    render(
      <Layout>
        <p>Conteúdo</p>
      </Layout>,
    )

    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })
})
