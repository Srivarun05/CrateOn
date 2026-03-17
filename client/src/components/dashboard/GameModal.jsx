import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Trash2 } from 'lucide-react'; 
import Api from '../../Api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const AVAILABLE_GENRES_LIST = ["Action", "RPG", "FPS", "Strategy", "Adventure", "Simulation", "SoulsLike", "OpenWorld", "Dark-Fantasy", "Indie"];

const GameModal = ({ isOpen, onClose, gameToEdit, refreshGames }) => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState([]); 
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (gameToEdit) {
      setName(gameToEdit.name || '');
      setDescription(gameToEdit.description || '');
      setIsFeatured(gameToEdit.isFeatured === true || gameToEdit.isFeatured === 'true');
      
      let dbGenres = gameToEdit.genre || [];
      if (typeof dbGenres === 'string') dbGenres = dbGenres.split(',').map(g => g.trim());
      setGenres(dbGenres);

      const rawImage = gameToEdit.image || gameToEdit.imageUrl;
      setImagePreview(getImageUrl(rawImage));
      setImageFile(null); 
    } else {
      resetForm();
    }
  }, [gameToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setGenres([]);
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setIsFeatured(false);
  };

  if (!isOpen) return null;

  const handleGenreToggle = (genreName) => {
    if (genres.includes(genreName)) {
      setGenres(genres.filter(g => g !== genreName)); 
    } else {
      setGenres([...genres, genreName]); 
    }
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setImageFile(null);
    setImagePreview(''); 
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${gameToEdit.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await Api.delete(`/game/${gameToEdit._id}`);
      
      refreshGames(); 
      onClose();      
    } catch (error) {
      console.error("Failed to delete game", error);
      alert(error.response?.data?.message || "Failed to delete game. Check console.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (genres.length === 0) return alert("Please select at least one genre.");
    if (!imagePreview && !imageFile && !gameToEdit) return alert("Please upload an image.");
    
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('genre', genres.join(', '));
    formData.append('isFeatured', isFeatured);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (gameToEdit) {        
        await Api.put(`/game/${gameToEdit._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await Api.post('/game', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      refreshGames(); 
      onClose();      
    } catch (error) {
      console.error("Failed to save game", error);
      alert(error.response?.data?.message || "Failed to save. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <div>
            <h2>{gameToEdit ? 'Edit Game' : 'Add New Game'}</h2>
            <p>Enter the details for the {gameToEdit ? 'existing' : 'new'} platform title</p>
          </div>
          <button className="close-btn" onClick={onClose} disabled={loading || isDeleting}><X size={24} /></button>
        </div>

        <div className="toggle-container">
            <div className="toggle-text-block">
              <span className="toggle-label">Feature in Hero Banner</span>
              <span className="toggle-desc">Showcase this game in the large rotating banner at the top of the dashboard.</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isFeatured} 
                onChange={(e) => setIsFeatured(e.target.checked)} 
                disabled={loading || isDeleting}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Game Title</label>
            <input type="text" placeholder="e.g. Apex Legends" value={name} onChange={e => setName(e.target.value)} required disabled={loading || isDeleting} />
          </div>

          <div className="form-group">
            <label>Genres (Select all that apply)</label>
            <div className="genre-checkbox-grid">
              {AVAILABLE_GENRES_LIST.map(genreName => (
                <div 
                  key={genreName} 
                  className={`genre-checkbox-item ${genres.includes(genreName) ? 'active' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    id={`genre-${genreName}`} 
                    checked={genres.includes(genreName)}
                    onChange={() => handleGenreToggle(genreName)}
                    disabled={loading || isDeleting}
                  />
                  <label htmlFor={`genre-${genreName}`}>{genreName}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" placeholder="Brief overview of the game mechanics and story..." value={description} onChange={e => setDescription(e.target.value)} required disabled={loading || isDeleting}></textarea>
          </div>
          
          <div className="form-group">
            <label>Game Cover Image</label>
            <input type="file" ref={fileInputRef} className="hidden-file-input" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleFileChange} disabled={loading || isDeleting} />
            {!imagePreview && (
              <div className="upload-zone" onClick={handleFileClick}>
                <UploadCloud size={32} className="upload-icon" />
                <div className="upload-text"><span>Upload a file</span> or drag and drop</div>
                <div className="upload-hint">PNG, JPG, GIF up to 10MB</div>
              </div>
            )}

            {imagePreview && (
              <div className="file-preview-card">
                <div className="file-preview-info">
                  <img src={imagePreview} alt="Preview" className="file-thumbnail" />
                  <div className="file-details">
                    <span className="file-name">
                      {imageFile ? imageFile.name : 'Current Cover Image'}
                    </span>
                    <span className="file-size">
                      {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB` : 'From Database'}
                    </span>
                    {imageFile && <div className="progress-bar"></div>}
                  </div>
                </div>
                <button type="button" className="remove-file-btn" onClick={removeFile} title="Remove Image" disabled={loading || isDeleting}>
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
          
          <div className="modal-actions" style={{ display: 'flex', justifyContent: gameToEdit ? 'space-between' : 'flex-end', marginTop: '32px' }}>
            
            {gameToEdit && (
              <button 
                type="button" 
                className="btn-danger" 
                onClick={handleDelete} 
                disabled={isDeleting || loading}
              >
                {isDeleting ? 'Deleting...' : 'Delete Game'}
              </button>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-cancel" onClick={onClose} disabled={loading || isDeleting}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading || isDeleting}>
                {loading ? 'Processing...' : (gameToEdit ? 'Update Game' : 'Create Game')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default GameModal;