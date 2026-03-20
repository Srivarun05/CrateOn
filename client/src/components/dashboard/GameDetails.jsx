import React, { useState, useEffect } from 'react';
import { X, Trash2, Send, Edit2, Check, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api';
import '../../styles/GameDetails.css'; 
import GameRating from '../../pages/dashboard/GameRating';
import GuestModal from '../common/GuestModal';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const GameDetails = ({ isOpen, onClose, game }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [showGuestModal, setShowGuestModal] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    if (isOpen && game) {
      fetchComments();
    } else {
      setComments([]); 
      setNewComment('');
      setEditingCommentId(null);
    }
  }, [isOpen, game]);

  const fetchComments = async () => {
    try {
      const response = await Api.get(`/comments/${game._id}`);
      setComments(response.data.data || []);
    } catch (error) {
      console.error("Could not fetch comments", error);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();

    if(!user) {
      setShowGuestModal(true);
      return;
    }
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await Api.post(`/comments/${game._id}`, { comment: newComment });
      setNewComment('');
      fetchComments(); 
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await Api.delete(`/comments/${commentId}`);
      fetchComments(); 
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const startEditing = (commentObj) => {
    setEditingCommentId(commentObj._id);
    setEditCommentText(commentObj.comment);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await Api.put(`/comments/${commentId}`, { comment: editCommentText });
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  if (!isOpen || !game) return null;

  const displayGenre = Array.isArray(game.genre) ? game.genre.join(' | ') : (game.genre || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={e => e.stopPropagation()}>
        
        <button className="details-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="details-image-section">
          <img src={getImageUrl(game.image || game.imageUrl)} alt={game.name} className="details-cover-image" />
        </div>

        <div className="details-info-section">
          <h1 className="details-title">{game.name}</h1>
          <p className="details-genre">{displayGenre.toUpperCase()}</p>
          <p className="details-desc">{game.description}</p>

          <GameRating gameId={game._id} />

          <div className="comments-container">
            <h3 className="comments-header">Community Discussions ({comments.length})</h3>
            
            <form className="comment-input-box" onSubmit={handlePostComment}>
              <input 
                type="text" 
                placeholder="Share your thoughts on this game..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <button type="submit" disabled={isSubmitting || !newComment.trim()}>
                <Send size={16} /> Post
              </button>
            </form>

            <div className="comment-list">
              {comments.length > 0 ? (
                comments.map(commentObj => {
                  const isOwner = user?._id === commentObj.user?._id;
                  
                  const canEdit = isOwner || isAdmin;

                  return (
                    <div key={commentObj._id} className="comment-item">
                      <div style={{ flexGrow: 1 }}>
                        <div className="comment-user">
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#333', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                            {(commentObj.user?.username || 'P')[0].toUpperCase()}
                          </div>
                          {commentObj.user?.username || 'Player'}
                        </div>
                        
                        {editingCommentId === commentObj._id ? (
                          <div className="admin-edit-comment-box">
                            <input 
                              type="text" 
                              value={editCommentText} 
                              onChange={(e) => setEditCommentText(e.target.value)} 
                              autoFocus
                            />
                            <button onClick={() => handleUpdateComment(commentObj._id)} className="btn-save-comment"><Check size={14}/></button>
                            <button onClick={() => setEditingCommentId(null)} className="btn-cancel-comment"><X size={14}/></button>
                          </div>
                        ) : (
                          <p className="comment-text">{commentObj.comment}</p>
                        )}
                      </div>
                      
                      {editingCommentId !== commentObj._id && (
                        <div className="admin-comment-controls">
                          
                          {canEdit && (
                            <button onClick={() => startEditing(commentObj)} title="Edit Comment"><Edit2 size={14} /></button>
                          )}
                          
                          {isAdmin && (
                            <button onClick={() => handleDeleteComment(commentObj._id)} title="Delete Comment" className="delete"><Trash2 size={14} /></button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#666', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>No comments yet. Start the discussion!</p>
              )}
            </div>
          </div>
        </div>
        <GuestModal 
          isOpen={showGuestModal} 
          onClose={() => setShowGuestModal(false)} 
          actionText="join the discussion" 
        />

      </div>
    </div>
  );
};

export default GameDetails;