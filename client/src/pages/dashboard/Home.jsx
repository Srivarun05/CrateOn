import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api'; 
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'; 
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import GameModal from '../../components/dashboard/GameModal';
import GameDetails from '../../components/dashboard/GameDetails';
import GuestModal from '../../components/common/GuestModal';
import { getImageUrl } from '../../config';
import '../../styles/dashboard.css';
import '../../styles/home.css';
import Footer from '../../components/layout/Footer';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Genre options are derived from whatever the API returns, so admins do not maintain this list twice.
  const allGenres = ['All', ...new Set(games.flatMap(game => {
    if (!game.genre) return [];
    return Array.isArray(game.genre) ? game.genre : [game.genre];
  }))].sort();

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesGenre = false;
    if (selectedGenre === 'All') {
      matchesGenre = true;
    } else if (Array.isArray(game.genre)) {
      matchesGenre = game.genre.includes(selectedGenre);
    } else {
      matchesGenre = game.genre === selectedGenre;
    }

    return matchesSearch && matchesGenre;
  });

  useEffect(() => {
    // Reset pagination whenever filters change so users always land on the first relevant result page.
    setCurrentPage(1);
  }, [searchQuery, selectedGenre]);


  let indexOfFirstGame = 0;
  let indexOfLastGame = 6;
  let totalPages = 1;

  if (filteredGames.length > 0) {
    // Page 1 intentionally highlights fewer cards because the hero banner occupies the top of the layout.
    if (currentPage === 1) {
      indexOfFirstGame = 0;
      indexOfLastGame = 6;
    } else {
      indexOfFirstGame = 6 + (currentPage - 2) * 9;
      indexOfLastGame = indexOfFirstGame + 9;
    }
    
    if (filteredGames.length <= 6) {
      totalPages = 1;
    } else {
      totalPages = 1 + Math.ceil((filteredGames.length - 6) / 9);
    }
  }

  const currentGamesToDisplay = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smoothly bring the grid back into view after page changes on longer screens.
    setTimeout(() => {
      gridTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const featuredGames = games.filter(game => game.isFeatured === true || String(game.isFeatured) === 'true');
  // When nothing is flagged as featured yet, we still keep the banner populated with the first few results.
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
      // Guests can browse the catalog, but their wishlist stays empty until they sign in.
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
    // Favorites are refetched when auth changes because wishlist data is user-specific.
    fetchGames();
    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (gameId) => {
    if (!user) {
      // Reuse the guest modal instead of forcing an abrupt redirect away from the page.
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
    // Clearing editingGame tells the modal to behave like a create flow instead of edit flow.
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
      <TopNav onOpenCreateModal={handleOpenCreate} />
      <SubNav 
        onOpenCreateModal={handleOpenCreate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        allGenres={allGenres}
       />

      <main className="dashboard-main">
        
        {currentPage === 1 && (
          <HeroBanner games={bannerGamesToDisplay} onViewDetails={handleViewDetails} />
        )}

        <div className="explore-header-row" ref={gridTopRef}>
            Explore Games <div className="section-line">
        </div>
          
          <div className="filter-ui-container">
            {selectedGenre !== 'All' && (
              <button className="clear-filter-btn" onClick={() => setSelectedGenre('All')}>
                {selectedGenre.toUpperCase()} <X size={14} strokeWidth={3} />
              </button>
            )}

            {/* <div className="filter-dropdown-wrapper">
              <Filter className="filter-icon" size={16} />
              <select 
                className="icon-select" 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="All">Filter by Genre</option>
                {allGenres.filter(g => g !== 'All').map(genre => (
                  <option key={genre} value={genre}>
                    {genre.toUpperCase()}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
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
                <p style={{ color: '#888', padding: '40px 0', textAlign: 'center', width: '100%' }}>
                  No games found matching your search. Try different keywords or genres!
                </p>
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

      <Footer />

    </div>
  );
};

export default Home;
