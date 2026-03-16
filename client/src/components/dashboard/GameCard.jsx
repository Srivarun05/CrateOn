import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="card-image-wrapper">
        {/* Looking for game.image or game.imageUrl from your DB */}
        <img src={game.image || game.imageUrl} alt={game.name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{game.name}</h3>
        
        <div className="card-status" style={{ marginBottom: '8px' }}>
          <span className="status-badge">{game.genre}</span>
        </div>
        
        <p style={{ 
          fontSize: '13px', 
          color: '#888', 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden' 
        }}>
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;