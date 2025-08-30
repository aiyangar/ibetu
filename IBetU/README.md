# 🚀 iBetu PWA + Supabase

Una aplicación Progressive Web App (PWA) moderna construida con React y Vite, conectada a Supabase para autenticación y gestión de datos en tiempo real.

## ✨ Características

- **📱 PWA Completa**: Instalable, offline y actualizable
- **🔐 Autenticación**: Sistema completo de login/registro con Supabase
- **📊 Base de Datos**: CRUD completo con PostgreSQL
- **⚡ Tiempo Real**: Suscripciones en tiempo real con Supabase
- **🎨 UI Moderna**: Interfaz responsiva con glassmorphism
- **🔒 Segura**: Autenticación JWT y políticas RLS

## 🛠️ Tecnologías

- **React 19**: Biblioteca de interfaz de usuario
- **Vite**: Herramienta de build rápida
- **Supabase**: Backend-as-a-Service (PostgreSQL + Auth + Realtime)
- **PWA**: Service Workers y Web App Manifest
- **CSS3**: Estilos modernos con gradientes

## 🚀 Configuración Rápida

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una nueva cuenta o inicia sesión
   - Crea un nuevo proyecto

2. **Obtener credenciales:**
   - Ve a Settings > API
   - Copia la URL del proyecto y la anon key

3. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 3. Configurar Base de Datos

Ejecuta el siguiente SQL en el Editor SQL de Supabase:

```sql
-- Crear tabla de items
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios solo vean sus propios items
CREATE POLICY "Users can only access their own items" ON items
  FOR ALL USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_items_updated_at 
  BEFORE UPDATE ON items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
IBetU/
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx          # Formulario de autenticación
│   │   └── DataManager.jsx       # Gestión de datos
│   ├── hooks/
│   │   ├── useAuth.js            # Hook de autenticación
│   │   └── useDatabase.js        # Hook de base de datos
│   ├── lib/
│   │   └── supabase.js           # Configuración de Supabase
│   ├── App.jsx                   # Componente principal
│   └── App.css                   # Estilos
├── public/
├── vite.config.js                # Configuración de Vite + PWA
└── package.json
```

## 🔧 Funcionalidades

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Persistencia de sesión
- Validación de formularios

### Gestión de Datos
- Crear items
- Leer items del usuario
- Actualizar items
- Eliminar items
- Filtros y ordenamiento
- Suscripciones en tiempo real

### PWA
- Instalable en dispositivos
- Funcionamiento offline
- Actualizaciones automáticas
- Service Worker configurado

## 🎯 Uso de la API

### Autenticación

```javascript
import { useAuth } from './hooks/useAuth'

const { user, signIn, signUp, signOut } = useAuth()

// Registrar usuario
await signUp('usuario@email.com', 'password123')

// Iniciar sesión
await signIn('usuario@email.com', 'password123')

// Cerrar sesión
await signOut()
```

### Base de Datos

```javascript
import { useDatabase } from './hooks/useDatabase'

const { fetchData, insertData, updateData, deleteData } = useDatabase()

// Obtener datos
const items = await fetchData('items', {
  filters: [{ column: 'user_id', operator: 'eq', value: userId }],
  orderBy: { column: 'created_at', ascending: false }
})

// Insertar datos
await insertData('items', {
  title: 'Nuevo Item',
  description: 'Descripción',
  user_id: userId
})

// Actualizar datos
await updateData('items', itemId, {
  title: 'Título Actualizado'
})

// Eliminar datos
await deleteData('items', itemId)
```

## 🔒 Seguridad

- **Row Level Security (RLS)**: Los usuarios solo pueden acceder a sus propios datos
- **Autenticación JWT**: Tokens seguros para autenticación
- **Validación**: Validación tanto en cliente como servidor
- **HTTPS**: Requerido para PWA y Supabase

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Despliegue en Vercel/Netlify

1. Conecta tu repositorio
2. Configura las variables de entorno
3. El comando de build será `npm run build`

### Variables de Entorno de Producción

Asegúrate de configurar las mismas variables de entorno en tu plataforma de despliegue:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🐛 Solución de Problemas

### Error de Conexión a Supabase
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que la URL y la anon key sean correctas
- Verifica que el proyecto de Supabase esté activo

### Error de Autenticación
- Verifica que la autenticación esté habilitada en Supabase
- Revisa las políticas RLS en la base de datos
- Verifica que el email esté confirmado

### Problemas de PWA
- Asegúrate de que estés en HTTPS en producción
- Verifica que el manifest.json esté configurado correctamente
- Revisa la consola del navegador para errores del Service Worker

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de PWA](https://web.dev/progressive-web-apps/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Disfruta desarrollando con iBetu PWA + Supabase! 🚀**
