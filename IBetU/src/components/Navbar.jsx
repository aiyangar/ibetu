import { useAuth } from '../hooks/useAuth'
import { useModal } from '../hooks/useModal'
import { AuthForm } from './AuthForm'
import '../styles/Navbar.css'

export function Navbar() {
  const { isOpen: showAuthModal, openModal: openAuthModal, closeModal: closeAuthModal } = useModal()
  const { user, signOut } = useAuth()

  const handleSignInClick = () => {
    openAuthModal()
  }

  const handleCloseModal = () => {
    closeAuthModal()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      <nav className={`navbar ${showAuthModal ? 'modal-active' : ''}`}>
        {/* Logo/Nombre del sitio centrado */}
        <div className="navbar-brand">
          <h1 className="navbar-title">🚀 iBetU</h1>
        </div>

        {/* Botones de autenticación a la derecha */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-section">
              <span className="user-email">{user.email}</span>
              <button 
                className="signout-button"
                onClick={handleSignOut}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          ) : (
            <button 
              className="signin-button"
              onClick={handleSignInClick}
            >
              🔐 Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={handleCloseModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h2>🔐 Iniciar Sesión</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <div className="auth-modal-content">
              <AuthForm />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
