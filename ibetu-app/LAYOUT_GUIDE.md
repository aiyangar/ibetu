# 🎯 Guía del Sistema de Layout - I Bet U

## 📋 Descripción General

El sistema de layout proporciona una estructura consistente y responsiva para toda la aplicación, con un ancho máximo de **1280px** y breakpoints optimizados para diferentes dispositivos.

## 🏗️ Estructura del Layout

```
Layout Container (100vw)
├── Top Section (sticky)
│   └── Width Container (max-width: 1280px)
├── Content Section (flex: 1)
│   └── Width Container (max-width: 1280px)
└── Bottom Section
    └── Width Container (max-width: 1280px)
```

## 🚀 Uso Básico

### 1. Layout Completo
```jsx
import { Layout } from './components/Layout'

<Layout
  top={<Header />}
  content={<MainContent />}
  bottom={<Footer />}
/>
```

### 2. Componentes Individuales
```jsx
import { LayoutTop, LayoutContent, LayoutBottom } from './components/Layout'

<>
  <LayoutTop>
    <Header />
  </LayoutTop>
  
  <LayoutContent>
    <MainContent />
  </LayoutContent>
  
  <LayoutBottom>
    <Footer />
  </LayoutBottom>
</>
```

## 🎨 Componentes de Utilidad

### LayoutSection
```jsx
import { LayoutSection } from './components/Layout'

<LayoutSection>
  <h2>Contenido de la sección</h2>
  <p>Texto con fondo translúcido y efecto blur</p>
</LayoutSection>
```

### LayoutCard
```jsx
import { LayoutCard } from './components/Layout'

<LayoutCard onClick={() => console.log('Card clicked')}>
  <h3>Título de la tarjeta</h3>
  <p>Contenido de la tarjeta</p>
</LayoutCard>
```

### LayoutGrid
```jsx
import { LayoutGrid } from './components/Layout'

<LayoutGrid columns={3}>
  <LayoutCard>Columna 1</LayoutCard>
  <LayoutCard>Columna 2</LayoutCard>
  <LayoutCard>Columna 3</LayoutCard>
</LayoutGrid>
```

## 📱 Breakpoints Responsivos

| Breakpoint | Descripción | Comportamiento |
|------------|-------------|----------------|
| **1280px** | Desktop grande | Ancho máximo aplicado |
| **1024px** | Desktop/Tablet | Padding reducido |
| **768px** | Tablet/Mobile | Layout vertical, padding ajustado |
| **480px** | Mobile pequeño | Padding mínimo, texto centrado |

## 🎯 Características Principales

### ✅ **Ancho Máximo**
- **1280px** para mantener legibilidad en pantallas grandes
- Centrado automático con márgenes
- Padding responsivo en los bordes

### ✅ **Responsividad**
- **Grid system** auto-fit con columnas responsivas
- **Flexbox** para distribución vertical
- **Media queries** optimizadas para cada breakpoint

### ✅ **Efectos Visuales**
- **Backdrop blur** para transparencias
- **Gradientes** de fondo consistentes
- **Sombras** y bordes sutiles
- **Transiciones** suaves en hover

### ✅ **Flexibilidad**
- Componentes modulares y reutilizables
- Clases CSS personalizables
- Sistema de grid configurable
- Soporte para contenido dinámico

## 🔧 Personalización

### Clases CSS Personalizadas
```jsx
<Layout
  className="custom-layout"
  topClassName="custom-top"
  contentClassName="custom-content"
  bottomClassName="custom-bottom"
/>
```

### Estilos CSS Personalizados
```css
.custom-top {
  background: rgba(255, 0, 0, 0.1);
}

.custom-content {
  padding: 60px 0;
}

.custom-bottom {
  background: rgba(0, 0, 0, 0.5);
}
```

## 📋 Ejemplos de Uso

### Dashboard con Sidebar
```jsx
<Layout
  top={<Navigation />}
  content={
    <div style={{ display: 'flex', gap: '20px' }}>
      <aside style={{ width: '250px' }}>
        <LayoutSection>Sidebar</LayoutSection>
      </aside>
      <main style={{ flex: 1 }}>
        <LayoutGrid columns={2}>
          <LayoutCard>Widget 1</LayoutCard>
          <LayoutCard>Widget 2</LayoutCard>
        </LayoutGrid>
      </main>
    </div>
  }
  bottom={<Footer />}
/>
```

### Landing Page
```jsx
<Layout
  top={<Header />}
  content={
    <>
      <LayoutSection>
        <h1>Hero Section</h1>
        <p>Contenido principal</p>
      </LayoutSection>
      
      <LayoutGrid columns={3}>
        <LayoutCard>Feature 1</LayoutCard>
        <LayoutCard>Feature 2</LayoutCard>
        <LayoutCard>Feature 3</LayoutCard>
      </LayoutGrid>
    </>
  }
  bottom={<Footer />}
/>
```

## 🎨 Paleta de Colores

### Fondos
- **Layout Container**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Top Section**: `rgba(255, 255, 255, 0.1)`
- **Content Section**: Transparente
- **Bottom Section**: `rgba(0, 0, 0, 0.2)`

### Componentes
- **LayoutSection**: `rgba(255, 255, 255, 0.05)`
- **LayoutCard**: `rgba(255, 255, 255, 0.08)`
- **LayoutCard Hover**: `rgba(255, 255, 255, 0.12)`

## 🚀 Mejores Prácticas

1. **Usa el Layout completo** para páginas principales
2. **Usa componentes individuales** para layouts personalizados
3. **Aprovecha el grid system** para contenido en columnas
4. **Mantén consistencia** en el uso de LayoutSection y LayoutCard
5. **Personaliza con clases CSS** cuando sea necesario
6. **Respeta el ancho máximo** de 1280px para contenido principal

## 🔍 Debugging

### Verificar Responsividad
1. Abre DevTools
2. Cambia el tamaño de la ventana
3. Verifica que los breakpoints funcionen correctamente
4. Comprueba que el ancho máximo se mantenga en 1280px

### Verificar Layout
1. Inspecciona los elementos con DevTools
2. Verifica que las clases CSS se apliquen correctamente
3. Comprueba que el flexbox funcione como esperado
4. Valida que el sticky positioning funcione en el top

---

**¡El sistema de layout está listo para crear interfaces consistentes y responsivas!** 🎉

