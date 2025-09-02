# I Bet U - React + Vite + Supabase + PWA

Este es un proyecto React creado con Vite, configurado para conectarse a Supabase y convertido en una PWA (Progressive Web App).

## 🚀 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Ejecutar el proyecto
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── SupabaseTest.jsx    # Componente de prueba de conexión
│   └── PWAPrompt.jsx       # Notificaciones PWA
├── hooks/
│   └── usePWA.js           # Hook para funcionalidades PWA
├── lib/
│   └── supabase.js         # Configuración del cliente Supabase
├── sw.js                    # Service Worker personalizado
├── App.jsx                  # Componente principal
└── main.jsx                 # Punto de entrada

public/
├── manifest.json            # Manifest de la PWA
├── offline.html             # Página offline
└── sw.js                    # Service Worker
```

## 🔧 Configuración de Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En la configuración del proyecto, copia la URL y la clave anónima
3. Crea el archivo `.env` con estas credenciales
4. El componente `SupabaseTest` verificará la conexión automáticamente

## 📱 Funcionalidades PWA

### ✅ **Características implementadas:**
- **Service Worker** para cache y funcionalidad offline
- **Manifest** para instalación en dispositivos
- **Notificaciones** de actualización disponible
- **Notificaciones** de aplicación lista offline
- **Página offline** personalizada
- **Cache inteligente** de recursos
- **Actualización automática** del Service Worker

### 🚀 **Beneficios PWA:**
- **Instalable** en dispositivos móviles y de escritorio
- **Funciona offline** con cache inteligente
- **Actualizaciones automáticas** en segundo plano
- **Experiencia nativa** en dispositivos móviles
- **Mejor rendimiento** con cache local

### 📋 **Para probar la PWA:**
1. Ejecuta `npm run build` para generar la versión de producción
2. Abre la aplicación en Chrome DevTools
3. Ve a la pestaña "Application" > "Service Workers"
4. Verifica que el Service Worker esté registrado
5. Prueba la funcionalidad offline desconectando la red

## 📝 Próximos Pasos

- [x] Configurar PWA básica
- [x] Service Worker con cache
- [x] Manifest y meta tags
- [ ] Configurar autenticación
- [ ] Crear tablas de base de datos
- [ ] Implementar funcionalidades principales
- [ ] Diseñar la interfaz de usuario

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **Supabase** - Backend as a Service
- **PWA Plugin** - Funcionalidades PWA
- **Workbox** - Service Worker y cache
- **JavaScript** - Lenguaje de programación

## 🔄 Comandos de Build

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```
