import '../styles/Layout.css'
import Navbar from './Navbar'
import Footer from './Footer'

export function Layout({ 
  top, 
  content, 
  bottom, 
  className = '',
  topClassName = '',
  contentClassName = '',
  bottomClassName = ''
}) {
  return (
    <div className={`layout-container ${className}`}>
      {/* Fixed navbar on all pages */}
      <Navbar />
      
      {/* Top Section */}
      {top && (
        <div className={`layout-top ${topClassName}`}>
          <div className="layout-width-container">
            <div className="layout-top-content">
              {top}
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      {content && (
        <div className={`layout-content ${contentClassName}`}>
          <div className="layout-width-container">
            <div className="layout-content-inner">
              {content}
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Section */}
      {bottom && (
        <div className={`layout-bottom ${bottomClassName}`}>
          <div className="layout-width-container">
            <div className="layout-bottom-content">
              {bottom}
            </div>
          </div>
        </div>
      )}
      
      {/* Fixed footer on all pages */}
      <Footer />
    </div>
  )
}

// Individual components for greater flexibility
export function LayoutTop({ children, className = '' }) {
  return (
    <div className={`layout-top ${className}`}>
      <div className="layout-width-container">
        <div className="layout-top-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export function LayoutContent({ children, className = '' }) {
  return (
    <div className={`layout-content ${className}`}>
      <div className="layout-width-container">
        <div className="layout-content-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

export function LayoutBottom({ children, className = '' }) {
  return (
    <div className={`layout-bottom ${className}`}>
      <div className="layout-width-container">
        <div className="layout-bottom-content">
          {children}
        </div>
      </div>
    </div>
  )
}

// Utility components
export function LayoutSection({ children, className = '' }) {
  return (
    <div className={`layout-section ${className}`}>
      {children}
    </div>
  )
}

export function LayoutCard({ children, className = '', onClick }) {
  return (
    <div 
      className={`layout-card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

export function LayoutGrid({ children, columns = 2, className = '' }) {
  const gridClass = `layout-grid layout-grid-${columns}`
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  )
}

