import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Api from '../../Api'; 
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import GameModal from '../../components/dashboard/GameModal';
import GameDetails from '../../components/dashboard/GameDetails';
import GuestModal from '../../components/common/GuestModal';
import '../../styles/dashboard.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingGame, setViewingGame] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef(null);

  let indexOfFirstGame = 0;
  let indexOfLastGame = 6;
  let totalPages = 1;

  if (games.length > 0) {
    if (currentPage === 1) {
      indexOfFirstGame = 0;
      indexOfLastGame = 6;
    } else {
      indexOfFirstGame = 6 + (currentPage - 2) * 9;
      indexOfLastGame = indexOfFirstGame + 9;
    }
    
    if (games.length <= 6) {
      totalPages = 1;
    } else {
      totalPages = 1 + Math.ceil((games.length - 6) / 9);
    }
  }

  const currentGamesToDisplay = games.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      gridTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
  }, [user]);

  const handleToggleFavorite = async (gameId) => {
    if (!user) {
      setShowGuestModal(true);
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
        
        {currentPage === 1 && (
          <HeroBanner games={bannerGamesToDisplay} onViewDetails={handleViewDetails} />
        )}

        <div className="section-header" ref={gridTopRef}>
          Explore Games <div className="section-line"></div>
        </div>
        
        {loading ? (
          <p style={{ color: '#888' }}>Loading games from database...</p>
        ) : (
          <>
            <div className="game-grid">
              {currentGamesToDisplay.length > 0 ? (
                currentGamesToDisplay.map(game => (
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

            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                 <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button 
                    key={index + 1} 
                    onClick={() => paginate(index + 1)}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
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

      <GuestModal 
        isOpen={showGuestModal} 
        onClose={() => setShowGuestModal(false)} 
        actionText="add games to your wishlist" 
      />

    </div>
  );
};

export default Home;