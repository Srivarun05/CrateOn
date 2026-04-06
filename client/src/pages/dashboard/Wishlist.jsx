import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api';
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import GameCard from '../../components/dashboard/GameCard';
import GameDetails from '../../components/dashboard/GameDetails';
import '../../styles/dashboard.css';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingGame, setViewingGame] = useState(null);

  useEffect(() => {
    if (!user) {
      // Wishlist is a personal page, so guests are pushed back before any request is made.
      navigate('/'); 
      return;
    }
    fetchMyWishlist();
  }, [user]);

  const fetchMyWishlist = async () => {
    try {
      const response = await Api.get('/favorites');
      
      // The favorites API returns wrapper objects; this page only needs the embedded game documents.
      const games = response.data.data.map(fav => fav.game);
      setWishlistGames(games.filter(g => g !== null)); 
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (gameId) => {
    try {
      await Api.post(`/favorites/${gameId}`);
      // Optimistically remove the card from the current view after a successful toggle.
      setWishlistGames(wishlistGames.filter(game => game._id !== gameId));
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  const handleViewDetails = (game) => {
    setViewingGame(game);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="steam-dashboard">
      <TopNav />
      <SubNav /> 

      <main className="dashboard-main" style={{ marginTop: '40px' }}>
        <div className="section-header">
          My Wishlist <div className="section-line"></div>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Loading your wishlist...</p>
        ) : (
          <div className="game-grid">
            {wishlistGames.length > 0 ? (
              wishlistGames.map(game => (
                <GameCard 
                  key={game._id} 
                  game={game} 
                  onEdit={() => {}} 
                  onViewDetails={handleViewDetails} 
                  isFavorited={true} 
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <p style={{ color: '#888', marginTop: '20px' }}>Your wishlist is empty. Go explore some games!</p>
            )}
          </div>
        )}
      </main>

      {isDetailsModalOpen && (
        <GameDetails 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
          game={viewingGame}
        />
      )}
    </div>
  );
};

export default Wishlist;
