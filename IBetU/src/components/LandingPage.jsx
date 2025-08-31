import { useState, useEffect } from 'react'
import { useDatabase } from '../hooks/useDatabase'
import { useAuth } from '../hooks/useAuth'
import '../LandingPage.css'

export function LandingPage() {
  const [topParticipant, setTopParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { fetchData } = useDatabase()
  const { user } = useAuth()

  useEffect(() => {
    loadTopParticipant()
  }, [])

  const loadTopParticipant = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener el participante con mayor total_paid
      const participants = await fetchData('participants', {
        orderBy: { column: 'total_paid', ascending: false },
        limit: 1
      })
      
      if (participants && participants.length > 0) {
        setTopParticipant(participants[0])
      } else {
        setError('No se encontraron participantes')
      }
    } catch (error) {
      console.error('Error cargando participante top:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="landing-container">
        <div className="loading-spinner"></div>
        <p>Cargando participante destacado...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="landing-container">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          {user && (
            <button onClick={loadTopParticipant} className="retry-button">
              🔄 Reintentar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="crown-icon">👑</div>
        <h1 className="main-title">
          {topParticipant?.nickname || 'Sin datos'}
        </h1>
        <p className="subtitle">
          Participante con mayor contribución
        </p>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Pagado:</span>
            <span className="stat-value">
              ${topParticipant?.total_paid?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Email:</span>
            <span className="stat-value">{topParticipant?.email || 'N/A'}</span>
          </div>
        </div>
        
        {!user && (
          <div className="cta-section">
            <p className="cta-text">¿Quieres ver más detalles?</p>
            <p className="cta-subtext">Inicia sesión para acceder a todas las funcionalidades</p>
          </div>
        )}
      </div>
      
      <div className="floating-elements">
        <div className="floating-icon">💰</div>
        <div className="floating-icon">🏆</div>
        <div className="floating-icon">⭐</div>
      </div>
    </div>
  )
}
