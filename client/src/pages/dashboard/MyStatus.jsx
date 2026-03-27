import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../Api';
import TopNav from '../../components/layout/TopNav';
import { Play, Calendar, CheckCircle, Pause, XCircle } from 'lucide-react';
import LibraryEditModal from '../../components/dashboard/LibraryEditModal'; 

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const STATUS_CATEGORIES = [
  { id: 'Playing', icon: <Play size={18} />, color: '#a855f7' },
  { id: 'Plan to Play', icon: <Calendar size={18} />, color: '#0ea5e9' },
  { id: 'Completed', icon: <CheckCircle size={18} />, color: '#84cc16' },
  { id: 'Paused', icon: <Pause size={18} />, color: '#f59e0b' },
  { id: 'Dropped', icon: <XCircle size={18} />, color: '#fb7185' }
];

const MyStatus = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Playing');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.error("Failed to update status");
    }
  };

  const displayedGames = statuses.filter(s => s.status === activeTab);

  return (
    <div className="steam-dashboard">
      <TopNav />
      <main className="dashboard-main">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>My Library</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Track and manage your gaming journey.</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #333', paddingBottom: '16px', overflowX: 'auto' }}>
          {STATUS_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                borderRadius: '8px', cursor: 'pointer', fontWeight: '600', border: 'none',
                background: activeTab === cat.id ? `${cat.color}22` : 'transparent',
                color: activeTab === cat.id ? cat.color : '#888',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {displayedGames.map(({ game, status }) => (
              <div key={game._id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                <div 
                  onClick={() => { setSelectedRecord({ game, status }); setIsModalOpen(true); }}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                  title="Click to edit tracking details"
                >
                  <img src={getImageUrl(game.image)} alt={game.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '16px 16px 0 16px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.name}</h3>
                  </div>
                </div>
                
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                    {[
                      { label: 'Completed', value: 'Completed', color: '#84cc16' },
                      { label: 'Planning', value: 'Plan to Play', color: '#0ea5e9' },
                      { label: 'Playing', value: 'Playing', color: '#a855f7' },
                      { label: 'Paused', value: 'Paused', color: '#f59e0b' },
                      { label: 'Dropped', value: 'Dropped', color: '#fb7185' }
                    ].map(opt => {
                      const isActive = status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleUpdateStatus(game._id, isActive ? '' : opt.value);
                          }}
                          style={{
                            flex: '1 1 auto', 
                            textAlign: 'center',
                            background: isActive ? opt.color : 'rgba(0,0,0,0.3)',
                            color: isActive ? '#000' : opt.color,
                            border: `1px solid ${isActive ? '#fff' : '#333'}`,
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                          title={isActive ? "Click to remove from library" : `Move to ${opt.label}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <LibraryEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        statusRecord={selectedRecord} 
        onSaveSuccess={fetchLibrary} 
      />

    </div>
  );
};

export default MyStatus;