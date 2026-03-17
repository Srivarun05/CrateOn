import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import Api from '../../Api';

const GameModal = ({ isOpen, onClose, gameToEdit, refreshGames }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (gameToEdit) {
      setName(gameToEdit.name || '');
      setGenre(gameToEdit.genre || '');
      setDescription(gameToEdit.description || '');
      setImagePreview(gameToEdit.image || gameToEdit.imageUrl || '');
      setImageFile(null); 
    } else {
      resetForm();
    }
  }, [gameToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setGenre('');
    setDescription('');
    setImageFile(null);
    setImagePreview('');
  };

  if (!isOpen) return null;

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setImageFile(null);
    setImagePreview(gameToEdit ? (gameToEdit.image || gameToEdit.imageUrl) : '');
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('genre', genre);
    formData.append('description', description);
    
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
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group">
              <label>Game Title</label>
              <input type="text" placeholder="e.g. Apex Legends" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select value={genre} onChange={e => setGenre(e.target.value)} required>
                <option value="" disabled>Select Genre</option>
                <option value="Action RPG">Action RPG</option>
                <option value="FPS">First-Person Shooter</option>
                <option value="Metroidvania">Metroidvania</option>
                <option value="Open World">Open World</option>
                <option value="Simulation">Simulation</option>
                <option value="Platformer">Platformer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" placeholder="Brief overview of the game mechanics and story..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
          </div>
          
          <div className="form-group">
            <label>Game Cover Image</label>
            <input type="file" ref={fileInputRef} className="hidden-file-input" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
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
                <button type="button" className="remove-file-btn" onClick={removeFile}>
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (gameToEdit ? 'Update Game' : 'Create Game')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameModal;