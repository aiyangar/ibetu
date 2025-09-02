import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        setOfflineReady(true)
      },
      onRegistered(swRegistration) {
        // swRegistration será undefined si el service worker no está registrado
        if (swRegistration) {
          console.log('Service Worker registrado:', swRegistration)
        }
      },
      onRegisterError(error) {
        console.error('Error registrando Service Worker:', error)
      }
    })

    return () => {
      // Cleanup si es necesario
    }
  }, [])

  const updateServiceWorker = () => {
    setNeedRefresh(false)
    window.location.reload()
  }

  const closeOfflineReady = () => {
    setOfflineReady(false)
  }

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    closeOfflineReady
  }
}
