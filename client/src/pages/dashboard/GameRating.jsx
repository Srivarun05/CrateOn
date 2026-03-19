import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api';
import '../../styles/rating.css';

const GameRating = ({ gameId }) => {
  const { user } = useAuth();
  
  const [rating, setRating] = useState(0); 
  const [hover, setHover] = useState(0); 
  const [animatingStar, setAnimatingStar] = useState(null);
  
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (gameId) fetchRatings();
  }, [gameId, user]);

  const fetchRatings = async () => {
    try {
      const response = await Api.get(`/ratings/${gameId}`);
      
      setAverage(response.data.average || 0);
      setCount(response.data.count || 0);
      setRating(response.data.userRating || 0);
      
    } catch (error) {
      console.error("Failed to fetch ratings", error);
    }
  };

  const handleRatingSubmit = async (selectedRating) => {
    if (!user) {
      alert("Please log in to rate this game!");
      return;
    }

    setAnimatingStar(selectedRating);
    setRating(selectedRating);
    setTimeout(() => setAnimatingStar(null), 300); 

    try {
      await Api.post(`/ratings/${gameId}`, { rating: selectedRating });
      fetchRatings(); 
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  const handleRemoveRating = async () => {
    try {
      await Api.delete(`/ratings/${gameId}`);
      setRating(0); 
      setHover(0);
      fetchRatings(); 
    } catch (error) {
      console.error("Failed to remove rating", error);
    }
  };

  return (
    <div className="rating-container">
      <div className="stars-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= (hover || rating);

          return (
            <button
              key={starValue}
              type="button"
              className={`star-btn ${animatingStar === starValue ? 'animating' : ''}`}
              onClick={() => handleRatingSubmit(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              title={`Rate ${starValue} stars`}
            >
              <Star
                size={24}
                fill={isFilled ? '#fbbf24' : 'none'} 
                color={isFilled ? '#fbbf24' : '#555'}
              />
            </button>
          );
        })}

        {rating > 0 && (
          <button 
            onClick={handleRemoveRating} 
            className="clear-rating-btn"
            title="Remove your rating"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="rating-stats">
        <span className="rating-average">
          {average > 0 ? Number(average).toFixed(1) : 'No ratings'} 
          <Star size={14} fill="#888" color="#888" />
        </span>
        <span className="rating-count">
          {count} {count === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>
    </div>
  );
};

export default GameRating;