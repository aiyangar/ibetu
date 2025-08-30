import { useState, useEffect } from 'react'
import { useDatabase } from '../hooks/useDatabase'
import { useAuth } from '../hooks/useAuth'

export function DataManager() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  
  const { user } = useAuth()
  const { 
    loading, 
    error, 
    fetchData, 
    insertData, 
    updateData, 
    deleteData,
    subscribeToChanges 
  } = useDatabase()

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [user])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToChanges('items', (payload) => {
        console.log('Cambio detectado:', payload)
        loadItems() // Recargar datos cuando hay cambios
      })

      return unsubscribe
    }
  }, [user])

  const loadItems = async () => {
    try {
      const data = await fetchData('items', {
        filters: [{ column: 'user_id', operator: 'eq', value: user.id }],
        orderBy: { column: 'created_at', ascending: false }
      })
      setItems(data || [])
    } catch (error) {
      console.error('Error cargando items:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newItem.title.trim()) return

    try {
      if (editingId) {
        // Actualizar item existente
        await updateData('items', editingId, {
          title: newItem.title,
          description: newItem.description,
          updated_at: new Date().toISOString()
        })
        setEditingId(null)
      } else {
        // Crear nuevo item
        await insertData('items', {
          title: newItem.title,
          description: newItem.description,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
      }
      
      setNewItem({ title: '', description: '' })
    } catch (error) {
      console.error('Error guardando item:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setNewItem({ title: item.title, description: item.description })
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        await deleteData('items', id)
      } catch (error) {
        console.error('Error eliminando item:', error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setNewItem({ title: '', description: '' })
  }

  if (!user) {
    return <p>Por favor inicia sesión para gestionar datos.</p>
  }

  return (
    <div className="data-manager">
      <h2>Gestionar Datos</h2>
      
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            required
            className="form-input"
            placeholder="Ingresa un título"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="form-input"
            placeholder="Ingresa una descripción"
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">Error: {error}</p>}

      <div className="items-list">
        <h3>Items ({items.length})</h3>
        
        {loading && <p>Cargando...</p>}
        
        {items.length === 0 && !loading && (
          <p>No hay items. ¡Crea uno nuevo!</p>
        )}
        
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <small>
                Creado: {new Date(item.created_at).toLocaleDateString()}
              </small>
            </div>
            
            <div className="item-actions">
              <button 
                onClick={() => handleEdit(item)}
                className="btn btn-small btn-secondary"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="btn btn-small btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
