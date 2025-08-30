import { useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { DataManager } from './components/DataManager'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('auth')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando aplicación...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 iBetu PWA + Supabase</h1>
        <p>Tu aplicación PWA conectada a Supabase</p>
      </header>

      <main className="App-main">
        {!user ? (
          <div className="auth-section">
            <h2>🔐 Autenticación</h2>
            <AuthForm />
          </div>
        ) : (
          <div className="dashboard">
            <nav className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'auth' ? 'active' : ''}`}
                onClick={() => setActiveTab('auth')}
              >
                👤 Perfil
              </button>
              <button 
                className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
                onClick={() => setActiveTab('data')}
              >
                📊 Datos
              </button>
            </nav>

            <div className="tab-content">
              {activeTab === 'auth' && (
                <div className="auth-section">
                  <h2>👤 Perfil de Usuario</h2>
                  <AuthForm />
                </div>
              )}
              
              {activeTab === 'data' && (
                <div className="data-section">
                  <DataManager />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>
          <strong>iBetu PWA</strong> - Conectado a Supabase
        </p>
        <p>
          Estado: {user ? '🟢 Autenticado' : '🔴 No autenticado'}
        </p>
      </footer>
    </div>
  )
}

export default App
