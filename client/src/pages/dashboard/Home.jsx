import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api'; 
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import GameModal from '../../components/dashboard/GameModal';
import '../../styles/dashboard.css';

const Home = () => {
  const { user } = useAuth(); 
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

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

  useEffect(() => {
    fetchGames();
  }, []);

  const handleOpenCreate = () => {
    setEditingGame(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    setEditingGame(game); 
    setIsModalOpen(true);
  };

  return (
    <div className="steam-dashboard">
      <TopNav />
      <SubNav onOpenCreateModal={handleOpenCreate} />

      <main className="dashboard-main">
        <HeroBanner games={games.slice(0, 3)} />

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
                />
              ))
            ) : (
              <p style={{ color: '#888' }}>No games found. Click "Create Game" to add one!</p>
            )}
          </div>
        )}
      </main>

      <GameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        gameToEdit={editingGame}
        refreshGames={fetchGames} 
      />

    </div>
  );
};

export default Home;