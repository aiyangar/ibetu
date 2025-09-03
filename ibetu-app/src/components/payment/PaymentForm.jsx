import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/PaymentForm.css';

const PaymentForm = () => {
  const [currentTop, setCurrentTop] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Get current top participant
    fetchCurrentTop();
  }, []);

  const fetchCurrentTop = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('nickname, total_paid')
        .order('total_paid', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setCurrentTop(data[0]);
      }
    } catch (error) {
      console.error('Error fetching top participant:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please sign in to make a payment');
      setMessageType('error');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      return;
    }

    if (currentTop && paymentAmount <= currentTop.total_paid) {
      setMessage(`You need to pay more than $${currentTop.total_paid} to beat ${currentTop.nickname}!`);
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get current participant
      const { data: participantData, error: participantError } = await supabase
        .from('participants')
        .select('id, total_paid')
        .eq('email', user.email)
        .single();

      if (participantError) throw participantError;

      // Insert payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            participant_id: participantData.id,
            amount: paymentAmount
          }
        ]);

      if (paymentError) throw paymentError;

      // Update total_paid
      const newTotal = participantData.total_paid + paymentAmount;
      const { error: updateError } = await supabase
        .from('participants')
        .update({ total_paid: newTotal })
        .eq('id', participantData.id);

      if (updateError) throw updateError;

      setMessage(`Payment successful! Your total is now $${newTotal.toFixed(2)}`);
      setMessageType('success');
      setAmount('');
      
      // Refresh current top
      await fetchCurrentTop();
    } catch (error) {
      console.error('Payment error:', error);
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getMinAmount = () => {
    if (!currentTop) return 0;
    return (currentTop.total_paid + 1).toFixed(2);
  };

  if (!isAuthenticated) {
    return (
      <div className="payment-form-container">
        <div className="payment-form-card">
          <h2 className="payment-form-title">🔐 Authentication Required</h2>
          <p className="payment-form-subtitle">
            Please sign in to make a payment and compete for the top spot!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <div className="payment-form-card">
        <h2 className="payment-form-title">🏆 Beat the Champion!</h2>
        
        {currentTop && (
          <div className="current-champion">
            <h3>Current Champion: {currentTop.nickname}</h3>
            <p className="champion-amount">Total: <span>${currentTop.total_paid}</span></p>
            <p className="challenge-text">
              To become the new champion, you need to pay more than ${currentTop.total_paid}!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="amount">Payment Amount ($)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min: $${getMinAmount()}`}
              min={getMinAmount()}
              step="0.01"
              required
              className="form-input"
            />
            {currentTop && (
              <small className="form-help">
                Minimum amount to beat {currentTop.nickname}: ${getMinAmount()}
              </small>
            )}
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="payment-submit-btn"
          >
            {loading ? 'Processing Payment...' : 'Make Payment & Compete!'}
          </button>
        </form>

        <div className="payment-info">
          <h4>💰 How it works:</h4>
          <ul>
            <li>Make a payment higher than the current champion</li>
            <li>Your payment is added to your previous total</li>
            <li>Become the new champion when you have the highest total</li>
            <li>All payments are tracked and cumulative</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
