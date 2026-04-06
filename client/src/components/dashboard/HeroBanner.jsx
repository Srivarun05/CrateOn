import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const HeroBanner = ({ games, onViewDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // The hero rotates only when there is more than one featured game to cycle through.
    if (!games || games.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000);
    return () => clearInterval(interval); 
  }, [games]);

  if (!games || games.length === 0) {
    return (
      <section className="hero-banner" style={{ backgroundColor: '#111', display: 'flex', 
      justifyContent: 'center', height: '380px', alignItems: 'center', borderRadius: '16px' }}>
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
        const displayGenre = Array.isArray(game.genre) ? game.genre.join(', ') : (game.genre || 'Featured');
        const imgUrl = getImageUrl(game.image || game.imageUrl);

        return (
          // All slides stay mounted so the fade animation can crossfade smoothly between them.
          <div 
            key={game._id || index} 
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              visibility: index === currentIndex ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out, visibility 0.8s',
              zIndex: index === currentIndex ? 1 : 0,
              display: 'flex', alignItems: 'center', padding: '48px',
              overflow: 'hidden'
            }}
          >
            <img 
              src={imgUrl} 
              alt="" 
              style={{ position: 'absolute', top: '-10%', 
                left: '-10%', width: '120%', height: '120%', 
                objectFit: 'cover', filter: 'blur(25px) brightness(0.3)', zIndex: 1 }}
            />

            <img 
              src={imgUrl} 
              alt="" 
              style={{ position: 'absolute', top: 0, left: 0, 
                width: '100%', height: '100%', objectFit: 'contain', 
                objectPosition: 'right center', zIndex: 2 }}
            />

            <div style={{ position: 'absolute', top: 0, left: 0, 
              width: '100%', height: '100%', 
              background: 'linear-gradient(to right, rgba(10,10,10,1) 15%, rgba(10,10,10,0.8) 45%, transparent 100%)', zIndex: 3 }} />

            <div className="hero-content" style={{ position: 'relative', zIndex: 4, maxWidth: '600px' }}>
              <div className="hero-tag" style={{ background: '#fff', color: '#000', 
                padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', 
                display: 'inline-block', marginBottom: '16px' }}>{displayGenre}</div>
              <h1 className="hero-title" style={{ fontSize: '42px', fontWeight: 'bold', 
                color: '#fff', marginBottom: '16px' }}>{game.name}</h1>
              
              <p style={{ color: '#aaa', marginBottom: '24px', fontSize: '15px', 
                lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {game.description}
              </p>
              
              <button className="hero-btn" onClick={() => onViewDetails(game)} style={{ background: '#fff', color: '#000', 
                border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Play size={18} fill="#000" /> View Details
              </button>
            </div>
          </div>
        );
      })}

      {games.length > 1 && (
        <div style={{ position: 'absolute', bottom: '24px', left: '48px', display: 'flex', gap: '8px', zIndex: 10 }}>
          {games.map((_, idx) => (
            <div 
              key={idx} onClick={() => setCurrentIndex(idx)}
              style={{ width: idx === currentIndex ? '32px' : '8px', height: '8px', borderRadius: '4px', 
                backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.3)', 
                cursor: 'pointer', transition: 'all 0.3s ease' }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
