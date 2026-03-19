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
      navigate('/'); // Kick guests out of this page
      return;
    }
    fetchMyWishlist();
  }, [user]);

  const fetchMyWishlist = async () => {
    try {
      // Your backend favoriteController returns: { data: [{ game: { ...gameDetails } }] }
      const response = await Api.get('/favorites');
      
      // Extract the populated 'game' objects from the favorites array
      const games = response.data.data.map(fav => fav.game);
      setWishlistGames(games.filter(g => g !== null)); // Filter out any nulls just in case
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (gameId) => {
    try {
      await Api.post(`/favorites/${gameId}`);
      // If we click the heart here, instantly remove it from the screen!
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
      {/* Reusing SubNav, but you can create a custom one if you want */}
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
                  onEdit={() => {}} // Not needed here
                  onViewDetails={handleViewDetails} 
                  isFavorited={true} // Everything here is favorited!
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