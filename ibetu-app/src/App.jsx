import { Layout } from './components/Layout'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <>
      {/* Landing Page with fixed Navbar and Footer */}
      <Layout
        content={<LandingPage />}
      />
    </>
  )
}

export default App
