import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/PaymentForm.css';

const PaymentForm = () => {
  const [currentTop, setCurrentTop] = useState(null);
  const [currentUserTotal, setCurrentUserTotal] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Get current top participant
    fetchCurrentTop();
  }, [user]); // Re-fetch when user changes

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

      // Also fetch current user's total
      if (user) {
        const userTotal = await getCurrentUserTotal();
        setCurrentUserTotal(userTotal);
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

    if (currentTop && (currentUserTotal + paymentAmount) <= currentTop.total_paid) {
      const amountNeeded = currentTop.total_paid - currentUserTotal + 1;
      setMessage(`You need to pay at least $${amountNeeded} to beat ${currentTop.nickname}!`);
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
    const amountNeeded = currentTop.total_paid - currentUserTotal + 1;
    return Math.max(0, amountNeeded).toFixed(2);
  };

  const getCurrentUserTotal = async () => {
    try {
      const { data: participantData, error } = await supabase
        .from('participants')
        .select('total_paid')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      return participantData.total_paid || 0;
    } catch (error) {
      console.error('Error fetching user total:', error);
      return 0;
    }
  };

  const getAmountNeeded = async () => {
    if (!currentTop) return 0;
    const userTotal = await getCurrentUserTotal();
    const amountNeeded = currentTop.total_paid - userTotal + 1;
    return Math.max(0, amountNeeded).toFixed(2);
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
             <p className="user-progress">Your Total: <span>${currentUserTotal}</span></p>
             <p className="challenge-text">
               You need to pay at least <span className="amount-needed">${getMinAmount()}</span> to become the new champion!
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
                 You need to pay at least $${getMinAmount()} to beat {currentTop.nickname}
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
            <li>Your payment is added to your previous total</li>
            <li>You only need to pay the difference to beat the champion</li>
            <li>Become the new champion when you have the highest total</li>
            <li>All payments are tracked and cumulative</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
