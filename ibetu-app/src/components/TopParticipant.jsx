import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/TopParticipant.css';

const TopParticipant = () => {
  const [topParticipant, setTopParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopParticipant();
  }, []);

  const fetchTopParticipant = async () => {
    try {
      setLoading(true);
      
      // Consulta para obtener el participante con mayor total_paid
      const { data, error } = await supabase
        .from('participants')
        .select('nickname, total_paid')
        .order('total_paid', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setTopParticipant(data[0]);
      }
    } catch (err) {
      console.error('Error fetching top participant:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-participant-container">
        <div className="top-participant-card loading">
          <div className="loading-spinner"></div>
          <p>Loading top participant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-participant-container">
        <div className="top-participant-card error">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  if (!topParticipant) {
    return (
      <div className="top-participant-container">
        <div className="top-participant-card">
          <p>No participants registered</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-participant-container">
      <div className="top-participant-card">
        <div className="crown-icon">👑</div>
        <h2 className="top-participant-title">Top Participant</h2>
        <div className="participant-info">
          <h3 className="participant-name">{topParticipant.nickname}</h3>
          <p className="participant-amount">
            Total paid: <span className="amount-highlight">${topParticipant.total_paid}</span>
          </p>
        </div>
        <div className="achievement-badge">
          🏆 Top Contributor
        </div>
      </div>
    </div>
  );
};

export default TopParticipant;
