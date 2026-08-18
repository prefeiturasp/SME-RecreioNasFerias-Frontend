import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('concatena classes simples', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('ignora valores falsy', () => {
    const condicaoFalsa = false
    expect(cn('p-2', condicaoFalsa && 'hidden', null, undefined, 'm-2')).toBe(
      'p-2 m-2',
    )
  })

  it('aplica classes condicionais via objeto', () => {
    expect(cn({ 'bg-primary': true, 'text-white': false })).toBe('bg-primary')
  })

  it('resolve conflitos de classes Tailwind com twMerge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })
})
