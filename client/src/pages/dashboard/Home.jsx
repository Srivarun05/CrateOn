import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Import Layout Components
import TopNav from '../../components/layout/TopNav';
import SubNav from '../../components/layout/SubNav';

// Import Dashboard Components
import HeroBanner from '../../components/dashboard/HeroBanner';
import GameCard from '../../components/dashboard/GameCard';
import AdminZone from '../../components/dashboard/AdminZone';

// Import Styles
import '../../styles/dashboard.css';

// Mock Data for the Library (We will replace this with a backend API call later)
const MOCK_GAMES = [
  { id: 1, title: 'Hollow Knight', status: 'Playing', progress: '65%', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop&grayscale=true' },
  { id: 2, title: 'Elden Ring', status: 'Backlog', progress: '0%', img: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2019&auto=format&fit=crop&grayscale=true' },
  { id: 3, title: 'Cyberpunk 2077', status: 'Completed', progress: '100%', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&grayscale=true' },
  { id: 4, title: 'The Witcher 3', status: 'Backlog', progress: '12%', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop&grayscale=true' },
];

const Home = () => {
  // Pull the real user data from your backend Context
  const { user } = useAuth(); 

  return (
    <div className="steam-dashboard">
      <TopNav />
      <SubNav />

      <main className="dashboard-main">
        <HeroBanner />

        {/* JUMP BACK IN ROW */}
        <div className="section-header">
          Featured & Active <div className="section-line"></div>
        </div>
        <div className="game-grid">
          {MOCK_GAMES.slice(0, 3).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* UP NEXT ROW (Passes isBacklog prop to change card styling/icons) */}
        <div className="section-header">
          Up Next In Backlog <div className="section-line"></div>
        </div>
        <div className="game-grid four-cols">
          {MOCK_GAMES.map(game => (
            <GameCard key={`backlog-${game.id}`} game={game} isBacklog={true} />
          ))}
        </div>

        {/* RBAC: ADMIN ONLY ZONE */}
        {/* This will only render if the logged-in user has the 'admin' role */}
        {user?.role === 'admin' && <AdminZone />}

      </main>
    </div>
  );
};

export default Home;