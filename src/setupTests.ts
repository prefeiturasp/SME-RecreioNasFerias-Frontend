import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

beforeEach(() => {
  import.meta.env.VITE_API_BASE_URL = ''
  import.meta.env.VITE_SME_INTEGRACAO_API_BASE_URL = ''
  import.meta.env.VITE_SME_INTEGRACAO_API_KEY = ''
})
