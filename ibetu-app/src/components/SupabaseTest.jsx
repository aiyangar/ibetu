import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function SupabaseTest() {
  const [status, setStatus] = useState('Testing connection...')
  const [error, setError] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Intentar hacer una consulta simple para verificar la conexión
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .limit(1)

      if (error) {
        if (error.code === 'PGRST116') {
          // Tabla no existe, pero la conexión funciona
          setStatus('✅ Connected to Supabase! (Table "participants" does not exist yet)')
        } else {
          setError(`Connection error: ${error.message}`)
          setStatus('❌ Connection failed')
        }
      } else {
        setStatus('✅ Connected to Supabase!')
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`)
      setStatus('❌ Connection failed')
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Supabase Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {error && (
        <p style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      <button onClick={testConnection} style={{ 
        padding: '8px 16px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Test Again
      </button>
    </div>
  )
}
