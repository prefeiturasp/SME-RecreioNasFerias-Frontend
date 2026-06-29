import type { PoloParceiro } from './types'

export const OPCOES_DRE_MOCK = [
  {
    valor: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
    rotulo: 'DIRETORIA REGIONAL DE EDUCACAO BUTANTA',
  },
  {
    valor: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
    rotulo: 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA',
  },
] as const

export const OPCOES_TIPO_UE_MOCK = [
  { valor: 'CEI', rotulo: 'CEI' },
  { valor: 'EMEF', rotulo: 'EMEF' },
  { valor: 'CEU', rotulo: 'CEU' },
] as const

const POLOS_BASE_MOCK: Omit<PoloParceiro, 'id'>[] = [
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'Cantinho Feliz',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'CEU XYZ',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'Cantinho Feliz',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'CEU XYZ',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'Cantinho Feliz',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'CEU XYZ',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'Cantinho Feliz',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'CEU XYZ',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'Cantinho Feliz',
  },
  {
    dre: 'BUTANTA',
    tipoUe: 'CEI',
    nomePolo: 'CEI DIRET ALOYSIO DE MENEZES PINTO NETO',
    nomeOsc: 'CEU XYZ',
  },
]

export const POLOS_PARCEIROS_MOCK: PoloParceiro[] = Array.from(
  { length: 200 },
  (_, indice) => ({
    id: `mock-polo-parceiro-${indice + 1}`,
    ...POLOS_BASE_MOCK[indice % POLOS_BASE_MOCK.length],
  }),
)
