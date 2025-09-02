import { usePWA } from '../hooks/usePWA'

export function PWAPrompt() {
  const { needRefresh, offlineReady, updateServiceWorker, closeOfflineReady } = usePWA()

  if (!needRefresh && !offlineReady) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      {/* Notificación de actualización disponible */}
      {needRefresh && (
        <div style={{
          backgroundColor: '#667eea',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontWeight: 'bold' }}>🔄 Nueva versión disponible</div>
          <div style={{ fontSize: '14px' }}>Hay una nueva versión de la aplicación disponible.</div>
          <button
            onClick={updateServiceWorker}
            style={{
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Actualizar
          </button>
        </div>
      )}

      {/* Notificación de offline ready */}
      {offlineReady && (
        <div style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>✅ Aplicación lista offline</div>
            <div style={{ fontSize: '14px' }}>La aplicación puede funcionar sin conexión.</div>
          </div>
          <button
            onClick={closeOfflineReady}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
