import React, { useState } from 'react';
import TopParticipant from './TopParticipant';
import AuthForm from './auth/AuthForm';
import PaymentForm from './payment/PaymentForm';
import { useAuth } from '../hooks/useAuth';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleBeatChampion = () => {
    if (isAuthenticated) {
      setShowPaymentForm(true);
      setShowAuthForm(false);
    } else {
      setShowAuthForm(true);
      setShowPaymentForm(false);
    }
  };

  const handleBackToTop = () => {
    setShowAuthForm(false);
    setShowPaymentForm(false);
  };

  // Show authentication form
  if (showAuthForm) {
    return (
      <div className="landing-content">
        <AuthForm onAuthSuccess={() => {
          setShowAuthForm(false);
          setShowPaymentForm(true);
        }} />
        <div className="back-button-container">
          <button onClick={handleBackToTop} className="back-btn">
            ← Back to Top Participant
          </button>
        </div>
      </div>
    );
  }

  // Show payment form
  if (showPaymentForm) {
    return (
      <div className="landing-content">
        <PaymentForm />
        <div className="back-button-container">
          <button onClick={handleBackToTop} className="back-button">
            ← Back to Top Participant
          </button>
        </div>
      </div>
    );
  }

  // Show main landing page
  return (
    <div className="landing-content">
      <TopParticipant />

      <div className="beat-champion-section">
        <h2 style={{ color: 'white', margin: '0 0 20px 0' }}></h2>
        <button onClick={handleBeatChampion} className="beat-champion-btn">
          {isAuthenticated ? '🏆 Beat the Champion!' : '🔐 Sign Up & Beat the Champion!'}
        </button>
        {isAuthenticated && (
          <p className="beat-champion-subtitle">
            Ready to compete? Make a payment higher than the current champion!
          </p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
