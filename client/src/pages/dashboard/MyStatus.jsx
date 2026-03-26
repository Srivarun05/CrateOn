import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../Api';
import TopNav from '../../components/layout/TopNav';
import { Play, Calendar, CheckCircle, Pause, XCircle } from 'lucide-react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const STATUS_CATEGORIES = [
  { id: 'Playing', icon: <Play size={18} />, color: '#3b82f6' },
  { id: 'Plan to Play', icon: <Calendar size={18} />, color: '#8b5cf6' },
  { id: 'Completed', icon: <CheckCircle size={18} />, color: '#10b981' },
  { id: 'Paused', icon: <Pause size={18} />, color: '#f59e0b' },
  { id: 'Dropped', icon: <XCircle size={18} />, color: '#ef4444' }
];

const MyStatus = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Playing');

  const fetchLibrary = async () => {
    try {
      const response = await Api.get('/status');
      setStatuses(response.data.data);
    } catch (error) {
      console.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleUpdateStatus = async (gameId, newStatus) => {
    try {
      await Api.put(`/status/${gameId}`, { status: newStatus });
      fetchLibrary();
    } catch (error) {
      console.error("Failed to update");
    }
  };

  const displayedGames = statuses.filter(s => s.status === activeTab);

  return (
    <div className="steam-dashboard">
      <TopNav />
      <main className="dashboard-main">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>My Library</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Track and manage your gaming journey.</p>

        {/* --- TABS --- */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
          {STATUS_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                borderRadius: '8px', cursor: 'pointer', fontWeight: '600', border: 'none',
                background: activeTab === cat.id ? `${cat.color}22` : 'transparent',
                color: activeTab === cat.id ? cat.color : '#888',
                transition: 'all 0.2s'
              }}
            >
              {cat.icon} {cat.id} ({statuses.filter(s => s.status === cat.id).length})
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Loading library...</p>
        ) : displayedGames.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#111', borderRadius: '12px', border: '1px dashed #333' }}>
            <p style={{ color: '#888' }}>No games in "{activeTab}" yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {displayedGames.map(({ game, status }) => (
              <div key={game._id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <img src={getImageUrl(game.image)} alt={game.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.name}</h3>
                  
                  <select 
                    value={status} 
                    onChange={(e) => handleUpdateStatus(game._id, e.target.value)}
                    style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #333', padding: '8px', borderRadius: '6px', outline: 'none' }}
                  >
                    <option value="">Remove from Library</option>
                    <option value="Playing">Playing</option>
                    <option value="Plan to Play">Plan to Play</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyStatus;