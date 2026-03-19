import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api'; 
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import GameModal from '../../components/dashboard/GameModal';
import GameDetails from '../../components/dashboard/GameDetails';
import '../../styles/dashboard.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingGame, setViewingGame] = useState(null);

  const featuredGames = games.filter(game => game.isFeatured === true || String(game.isFeatured) === 'true');
  const bannerGamesToDisplay = featuredGames.length > 0 ? featuredGames : games.slice(0, 3);

  const fetchGames = async () => {
    try {
      const response = await Api.get('/games'); 
      setGames(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteIds([]); 
      return; 
    }
    try {
      const response = await Api.get('/favorites'); 
      const ids = response.data.data.map(fav => typeof fav.game === 'object' ? fav.game._id : fav.game);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (gameId) => {
    if (!user) {
      alert("Please log in to add games to your wishlist!");
      return; 
    }

    try {
      await Api.post(`/favorites/${gameId}`);
      
      if (favoriteIds.includes(gameId)) {
        setFavoriteIds(favoriteIds.filter(id => id !== gameId)); 
      } else {
        setFavoriteIds([...favoriteIds, gameId]); 
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleOpenCreate = () => {
    setEditingGame(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    setEditingGame(game); 
    setIsModalOpen(true);
  };

  const handleViewDetails = (game) => {
    setViewingGame(game);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="steam-dashboard">
      <TopNav />
      <SubNav onOpenCreateModal={handleOpenCreate} />

      <main className="dashboard-main">
        <HeroBanner games={bannerGamesToDisplay} onViewDetails={handleViewDetails} />

        <div className="section-header">
          Explore Games <div className="section-line"></div>
        </div>
        
        {loading ? (
          <p style={{ color: '#888' }}>Loading games from database...</p>
        ) : (
          <div className="game-grid">
            {games.length > 0 ? (
              games.map(game => (
                <GameCard 
                  key={game._id || game.id} 
                  game={game} 
                  onEdit={handleOpenEdit}
                  onViewDetails={handleViewDetails}
                  isFavorited={favoriteIds.includes(game._id)}
                  onToggleFavorite={handleToggleFavorite} 
                />
              ))
            ) : (
              <p style={{ color: '#888' }}>No games found. Click "Create Game" to add one!</p>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <GameModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          gameToEdit={editingGame}
          refreshGames={fetchGames} 
        />
      )}

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

export default Home;