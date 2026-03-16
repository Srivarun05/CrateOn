import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

const GameCard = ({ game, isBacklog = false }) => {
  return (
    <div className="game-card">
      <div className="card-image-wrapper">
        <img src={game.img} alt={game.title} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{game.title}</h3>
        
        {/* Render standard status OR backlog actions based on prop */}
        {!isBacklog ? (
          <div className="card-status">
            <span className="status-badge">{game.status}</span>
            <span>{game.progress} Completed</span>
          </div>
        ) : (
          <div className="card-status">
            <span style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
              <Plus size={14} style={{ marginRight: '4px' }}/> Log Time
            </span>
            <MoreHorizontal size={16} color="#666"/>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default GameCard;