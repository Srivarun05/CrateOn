import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const HeroBanner = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!games || games.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000);

    return () => clearInterval(interval); 
  }, [games]);

  if (!games || games.length === 0) {
    return (
      <section className="hero-banner" style={{ backgroundColor: '#111', display: 'flex', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Loading Featured Games...</p>
      </section>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '380px', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      marginBottom: '48px', 
      border: '1px solid #333',
      backgroundColor: '#0a0a0a'
    }}>
      
      {games.map((game, index) => {
        const displayGenre = Array.isArray(game.genre) 
          ? game.genre.join(', ') 
          : (game.genre || 'Featured');

        return (
          <div 
            key={game._id || index} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.1) 100%), url(${getImageUrl(game.image || game.imageUrl)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentIndex ? 1 : 0,
              visibility: index === currentIndex ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out, visibility 0.8s',
              zIndex: index === currentIndex ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              padding: '48px'
            }}
          >
            <div className="hero-content" style={{ maxWidth: '600px' }}>
              <div className="hero-tag">{displayGenre}</div>
              <h1 className="hero-title">{game.name}</h1>
              
              <p style={{ 
                color: '#aaa', 
                marginBottom: '24px', 
                fontSize: '15px',
                lineHeight: '1.5',
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
              }}>
                {game.description}
              </p>
              
              <button className="hero-btn">
                <Play size={18} fill="#000" /> View Details
              </button>
            </div>
          </div>
        );
      })}

      {games.length > 1 && (
        <div style={{ 
          position: 'absolute', 
          bottom: '24px', 
          left: '48px', 
          display: 'flex', 
          gap: '8px', 
          zIndex: 10 
        }}>
          {games.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              style={{ 
                width: idx === currentIndex ? '32px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.3)', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease' 
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;