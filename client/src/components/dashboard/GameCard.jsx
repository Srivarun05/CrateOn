import React from 'react';
import { Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GameCard = ({ game, onEdit }) => {
  const { user } = useAuth();

  return (
    <div className="game-card" style={{ position: 'relative' }}>
      
      {user?.role === 'admin' && (
        <button 
          className="edit-btn" 
          onClick={() => onEdit(game)} 
          title="Edit Game"
        >
          <Edit2 size={16} />
        </button>
      )}

      <div className="card-image-wrapper">
        <img src={game.image?.startsWith('http') ? game.image : `http://localhost:8000/${game.image?.replace(/\\/g, "/")}`} alt={game.name} className="card-image" />
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