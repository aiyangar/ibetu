# Estilos CSS - iBetU

Esta carpeta contiene todos los archivos CSS organizados de manera modular para el proyecto iBetU.

## 📁 Estructura de Archivos

### Archivos Principales

- **`index.css`** - Estilos globales y base de la aplicación
- **`App.css`** - Estilos principales del componente App
- **`MainLayout.css`** - Estilos del layout principal y estructura general

### Componentes Específicos

- **`Navbar.css`** - Estilos del componente Navbar (navegación)
- **`LandingPage.css`** - Estilos del componente LandingPage
- **`Footer.css`** - Estilos del componente Footer

## 🎨 Características

### Diseño System
- **Glassmorphism**: Efectos de cristal con `backdrop-filter`
- **Gradientes**: Fondos con gradientes modernos
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Animaciones**: Transiciones y efectos suaves

### Paleta de Colores
- **Primario**: `#667eea` a `#764ba2` (gradiente azul-púrpura)
- **Acento**: `#ffd700` (dorado)
- **Error**: `#ff6b6b` (rojo)
- **Éxito**: `#4caf50` (verde)

### Breakpoints
- **Mobile**: `max-width: 480px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `min-width: 769px`
- **Landscape**: `max-height: 500px and orientation: landscape`

## 📱 Responsividad

Todos los componentes incluyen:
- **Mobile First**: Diseño optimizado para móviles
- **Flexbox**: Layout flexible y adaptativo
- **Clamp()**: Tamaños de fuente responsivos
- **Media Queries**: Ajustes específicos por dispositivo

## 🔧 Uso

Para usar estos estilos en un componente:

```javascript
import '../styles/NombreComponente.css'
```

## 📋 Mantenimiento

- Mantener la organización modular
- Usar variables CSS cuando sea posible
- Documentar cambios importantes
- Seguir las convenciones de nomenclatura
- Probar en todos los breakpoints
