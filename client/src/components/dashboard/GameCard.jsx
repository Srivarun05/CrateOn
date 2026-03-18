import React from 'react';
import { Edit2, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const GameCard = ({ game, onEdit, onViewDetails, isFavorited, onToggleFavorite }) => {
  const { user } = useAuth();
  const displayGenre = Array.isArray(game.genre) 
    ? game.genre.join(' | ') 
    : (game.genre || 'Explore');

  return (
    <div className="game-card" onClick={() => onViewDetails(game)} 
    style={{ position: 'relative', cursor: 'pointer' }}>

      <button 
        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
        title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleFavorite(game._id); 
        }} 
      >
        <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : '#fff'} />
      </button>
      
      {user?.role === 'admin' && (
        <button className="edit-btn" title="Edit Game"
        onClick={(e) => { e.stopPropagation(); onEdit(game); }} >
          <Edit2 size={16} />
        </button>
      )}

      <div className="card-image-wrapper">
        <img src={getImageUrl(game.image || game.imageUrl)} alt={game.name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{game.name}</h3>
        <p className="game-card-genre">{displayGenre}</p>        
        <p style={{ 
          fontSize: '13px', color: '#888', display: '-webkit-box', 
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
        }}>
          {game.description}
        </p>
      </div>
    </div>
  );
};

export default GameCard;