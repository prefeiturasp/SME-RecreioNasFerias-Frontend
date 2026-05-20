import { BrowserRouter } from 'react-router-dom'
import { Header } from '../components/Header'
import { AppRoutes } from '../routes'
import { Layout } from './style'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}
