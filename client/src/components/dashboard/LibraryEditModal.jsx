import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Api from '../../Api';
import '../../styles/librarymodal.css'; 

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

// Helper to format dates for the HTML <input type="date">
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const LibraryEditModal = ({ isOpen, onClose, statusRecord, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    status: 'Playing',
    playTime: 0,
    startDate: '',
    endDate: '',
    ngPlus: 0,
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && statusRecord) {
      // The modal mirrors the selected library record so edits feel like an in-place detail view.
      setFormData({
        status: statusRecord.status || 'Playing',
        playTime: statusRecord.playTime || 0,
        startDate: formatDateForInput(statusRecord.startDate),
        endDate: formatDateForInput(statusRecord.endDate),
        ngPlus: statusRecord.ngPlus || 0,
        notes: statusRecord.notes || ''
      });
    }
  }, [isOpen, statusRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Saving writes back to the same status endpoint used by the quick status pills elsewhere.
      await Api.put(`/status/${statusRecord.game._id}`, formData);
      onSaveSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Failed to save tracking details", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !statusRecord) return null;

  const game = statusRecord.game;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div className="tracker-modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="tracker-hero" style={{ backgroundImage: `url(${getImageUrl(game.image)})` }}>
          <div className="tracker-hero-overlay"></div>
          <button className="tracker-close-btn" onClick={onClose}><X size={20} /></button>
          
          <div className="tracker-hero-content">
            <img src={getImageUrl(game.image)} alt={game.name} className="tracker-cover" />
            <h2 className="tracker-title">{game.name}</h2>
            
            <button className="tracker-save-top-btn" onClick={handleSubmit} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <form className="tracker-form" onSubmit={handleSubmit}>
          
          <div className="tracker-grid">
            <div className="tracker-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Playing">Playing</option>
                <option value="Plan to Play">Plan to Play</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="tracker-group">
              <label>Play Time (Hours)</label>
              <input type="number" name="playTime" min="0" value={formData.playTime} onChange={handleChange} />
            </div>

            <div className="tracker-group">
              <label>NG+</label>
              <input type="number" name="ngPlus" min="0" value={formData.ngPlus} onChange={handleChange} />
            </div>

            <div className="tracker-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="tracker-group">
              <label>Finish Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>

          <div className="tracker-group full-width" style={{ marginTop: '24px' }}>
            <label>Personal Notes</label>
            <textarea 
              name="notes" 
              rows="3" 
              placeholder="Write down your thoughts, build ideas, or review here..."
              value={formData.notes} 
              onChange={handleChange} 
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default LibraryEditModal;
