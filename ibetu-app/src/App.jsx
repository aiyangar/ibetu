import { Layout } from './components/Layout'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <>
      {/* Landing Page con Navbar y Footer fijos */}
      <Layout
        content={<LandingPage />}
      />
    </>
  )
}

export default App
