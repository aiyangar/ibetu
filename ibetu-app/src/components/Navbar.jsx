import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  // Close menu when authentication state changes
  useEffect(() => {
    closeMenu();
  }, [isAuthenticated]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">🚀 I Bet U</h1>
        
        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Dropdown Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          {/* Authentication Status Indicator */}
          <div className="menu-header">
            <span className="auth-status">
              {isAuthenticated ? '🟢 Authenticated' : '🔴 Not Authenticated'}
            </span>
          </div>
          
          {!isAuthenticated ? (
            <>
              <button 
                className="menu-item auth-item"
                onClick={() => {
                  // Dispatch custom event for authentication
                  window.dispatchEvent(new CustomEvent('menu-navigation', {
                    detail: { action: 'auth' }
                  }));
                  closeMenu();
                }}
              >
                🔐 Sign In
              </button>
              <button 
                className="menu-item auth-item"
                onClick={() => {
                  // Dispatch custom event for champion
                  window.dispatchEvent(new CustomEvent('menu-navigation', {
                    detail: { action: 'champion' }
                  }));
                  closeMenu();
                }}
              >
                🏆 Beat the Champion
              </button>
            </>
          ) : (
            <>
              <button 
                className="menu-item champion-item"
                onClick={() => {
                  // Dispatch custom event for champion
                  window.dispatchEvent(new CustomEvent('menu-navigation', {
                    detail: { action: 'champion' }
                  }));
                  closeMenu();
                }}
              >
                🏆 Beat the Champion
              </button>
              <button 
                className="menu-item signout-item"
                onClick={handleSignOut}
              >
                🚪 Sign Out
              </button>
            </>
          )}
        </div>

        {/* Backdrop to close menu when clicking outside */}
        {isMenuOpen && (
          <div className="menu-backdrop" onClick={closeMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
