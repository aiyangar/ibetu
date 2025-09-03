import React from 'react';
import TopParticipant from './TopParticipant';

const LandingPage = () => {
  return (
    <>
      {/* Participante destacado en el centro */}
      <TopParticipant />
      
      {/* Contenido adicional de la landing page */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ color: 'white', margin: '0 0 20px 0' }}>
          🎯 Bienvenido a I Bet U
        </h2>
        <p style={{ color: 'white', opacity: 0.9, lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
          Descubre quién es el participante más destacado de nuestra comunidad. 
          El sistema reconoce automáticamente a quienes más contribuyen.
        </p>
      </div>
    </>
  );
};

export default LandingPage;
