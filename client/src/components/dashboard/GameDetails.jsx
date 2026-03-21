import React, { useState, useEffect } from 'react';
import { X, Trash2, Send, Edit2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Api from '../../Api';
import GameRating from '../../pages/dashboard/GameRating';
import GuestModal from '../common/GuestModal';
import '../../styles/GameDetails.css'; 

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

// 👇 Restored the props!
const GameDetails = ({ isOpen, onClose, game }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeComment, setActiveComment] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    if (isOpen && game) {
      fetchComments();
    } else {
      setComments([]); 
      setNewComment('');
      setActiveComment(null);
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
      setActiveComment(null);
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
      setActiveComment(null);
      fetchComments();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const closeCommentModal = () => {
    setActiveComment(null);
    setEditingCommentId(null);
  };

  if (!isOpen || !game) return null;

  const displayGenre = Array.isArray(game.genre) ? game.genre.join(' | ') : (game.genre || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* 👇 Restored the X Close Button */}
        <button className="details-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="details-image-section">
          <div className="details-blur-background" style={{ backgroundImage: `url(${getImageUrl(game.image || game.imageUrl)})` }} />
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
                comments.map(commentObj => (
                  <div key={commentObj._id} className="comment-item clickable-comment" onClick={() => setActiveComment(commentObj)}>
                    <div className="comment-user">
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>
                        {(commentObj.user?.username || 'P')[0].toUpperCase()}
                      </div>
                      {commentObj.user?.username || 'Player'}
                    </div>
                    <p className="comment-text truncated-comment">{commentObj.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#666', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>No comments yet. Start the discussion!</p>
              )}
            </div>
          </div>
        </div>
        
        <GuestModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} actionText="join the discussion" />

        {/* Comment Popup Modal */}
        {activeComment && (
          <div className="modal-overlay" onClick={closeCommentModal}>
            <div className="comment-popup-content" onClick={e => e.stopPropagation()}>
              <div className="comment-popup-header">
                <div className="comment-user">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>
                    {(activeComment.user?.username || 'P')[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                    {activeComment.user?.username || 'Player'}
                  </span>
                </div>
                <button className="close-popup-btn" onClick={closeCommentModal}><X size={20} /></button>
              </div>

              <div className="comment-popup-body">
                {editingCommentId === activeComment._id ? (
                  <div className="admin-edit-comment-box" style={{ marginTop: 0 }}>
                    <textarea 
                      value={editCommentText} 
                      onChange={(e) => setEditCommentText(e.target.value)} 
                      autoFocus
                      rows="4"
                      className="edit-comment-textarea"
                    />
                  </div>
                ) : (
                  <p className="comment-popup-text">{activeComment.comment}</p>
                )}
              </div>

              {(user?._id === activeComment.user?._id || isAdmin) && (
                <div className="comment-popup-actions">
                  {editingCommentId === activeComment._id ? (
                    <>
                      <button onClick={() => setEditingCommentId(null)} className="action-btn cancel"><X size={16}/> Cancel</button>
                      <button onClick={() => handleUpdateComment(activeComment._id)} className="action-btn save"><Check size={16}/> Save</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(activeComment)} className="action-btn edit"><Edit2 size={16}/> Edit</button>
                      {isAdmin && <button onClick={() => handleDeleteComment(activeComment._id)} className="action-btn delete"><Trash2 size={16}/> Delete</button>}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GameDetails;