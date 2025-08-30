import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDatabase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Función genérica para obtener datos
  const fetchData = async (table, query = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      let queryBuilder = supabase.from(table).select('*')
      
      // Aplicar filtros si existen
      if (query.filters) {
        query.filters.forEach(filter => {
          queryBuilder = queryBuilder.filter(filter.column, filter.operator, filter.value)
        })
      }
      
      // Aplicar ordenamiento si existe
      if (query.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, { ascending: query.orderBy.ascending })
      }
      
      // Aplicar límite si existe
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit)
      }
      
      const { data, error } = await queryBuilder
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para insertar datos
  const insertData = async (table, data) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
      
      if (error) throw error
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar datos
  const updateData = async (table, id, updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar datos
  const deleteData = async (table, id) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para suscribirse a cambios en tiempo real
  const subscribeToChanges = (table, callback) => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: table }, 
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // Función para subir archivos
  const uploadFile = async (bucket, path, file) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener URL de archivo
  const getFileUrl = (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  return {
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData,
    subscribeToChanges,
    uploadFile,
    getFileUrl
  }
}
