import { useAuth } from '../hooks/useAuth'
import '../styles/Footer.css'

export function Footer() {
  const { user } = useAuth()

  return (
    <footer className="App-footer">
      <p>
        <strong>iBetU PWA</strong> - Conectado a Supabase
      </p>
      <p>
        Estado: {user ? '🟢 Autenticado' : '🔴 No autenticado'}
      </p>
    </footer>
  )
}
