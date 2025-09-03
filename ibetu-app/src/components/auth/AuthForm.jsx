import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles/AuthForm.css';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to login mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSigningIn, setAutoSigningIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage('Login successful! 🎯 Redirecting to payment form...');
        setMessageType('success');
        
        // Auto-redirect after successful login
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess();
          }
        }, 1500); // Slightly faster for login
      } else {
        // Registration
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        // Create participant record
        const { error: participantError } = await supabase
          .from('participants')
          .insert([
            {
              email,
              nickname,
              total_paid: 0
            }
          ]);

        if (participantError) throw participantError;

        // After successful registration, automatically sign in
        setAutoSigningIn(true);
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If auto-signin fails, show message but don't block
          console.warn('Auto-signin failed:', signInError);
          setMessage('Registration successful! Please sign in manually.');
          setMessageType('success');
          setAutoSigningIn(false);
        } else {
          // Auto-signin successful
          setMessage('Registration successful! 🚀 Auto-signing you in...');
          setMessageType('success');
          
          // Auto-redirect after successful auto-signin
          setTimeout(() => {
            if (onAuthSuccess) {
              onAuthSuccess();
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setEmail('');
    setPassword('');
    setNickname('');
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h2 className="auth-form-title">
          {isLogin ? '🚀 Welcome Back!' : '🏆 Join I Bet U & Beat the Champion!'}
        </h2>
        
        {isLogin ? (
          <p className="auth-form-subtitle">
            Sign in to compete for the top spot!
          </p>
        ) : (
          <p className="auth-form-subtitle">
            Create your account to start competing for the top spot!
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nickname">Nickname</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                required={!isLogin}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
              {autoSigningIn && (
                <div className="auto-signin-indicator">
                  <div className="spinner"></div>
                  <span>Setting up your session...</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || autoSigningIn}
            className="auth-submit-btn"
          >
            {loading ? 'Processing...' : 
             autoSigningIn ? '🚀 Auto-signing in...' : 
             (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-btn"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
                           {isLogin && (
                   <p className="auth-info">
                     💡 New users? Use "Sign Up" to create an account first
                   </p>
                 )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
