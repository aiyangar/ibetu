import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  
  const { user, loading, error, signIn, signUp, signOut } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    try {
      if (isSignUp) {
        await signUp(email, password)
        setMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.')
      } else {
        await signIn(email, password)
        setMessage('¡Inicio de sesión exitoso!')
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setMessage('Sesión cerrada exitosamente')
    } catch (error) {
      setMessage(`Error al cerrar sesión: ${error.message}`)
    }
  }

  if (user) {
    return (
      <div className="auth-container">
        <h2>¡Bienvenido, {user.email}!</h2>
        <p>Tu ID de usuario: {user.id}</p>
        <button 
          onClick={handleSignOut}
          disabled={loading}
          className="auth-button signout"
        >
          {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</h2>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="form-input"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Procesando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
        </button>
      </form>
      
      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        className="toggle-button"
      >
        {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
      
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
