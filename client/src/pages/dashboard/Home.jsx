import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api'; 
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import AdminZone from '../../components/dashboard/AdminZone';
import '../../styles/dashboard.css';

const Home = () => {
  const { user } = useAuth(); 
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await Api.get('/games'); 
        setGames(response.data.data || response.data || []);
      } catch (error) {
        console.error("Error fetching games from database:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="steam-dashboard">
      <TopNav />
      <SubNav />

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
                <GameCard key={game._id || game.id} game={game} />
              ))
            ) : (
              <p style={{ color: '#888' }}>No games found in the database.</p>
            )}
          </div>
        )}

        {user?.role === 'admin' && <AdminZone />}

      </main>
    </div>
  );
};

export default Home;