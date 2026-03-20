import React, { useState, useEffect } from 'react';
import { Trash2, User as UserIcon, Shield, User } from 'lucide-react';
import Api from '../../Api';
import TopNav from '../../components/layout/TopNav';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await Api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser._id) {
      return alert("You cannot delete your own admin account!");
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"?`)) {
      return;
    }

    try {
      await Api.delete(`/users/${userId}`);
      // Remove the deleted user from the UI immediately
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="steam-dashboard">
      <TopNav />
      
      <main className="dashboard-main">
        <div className="section-header" style={{ marginTop: '24px' }}>
          User Management <div className="section-line"></div>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Loading users...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {u.profilePic ? (
                            <img src={getImageUrl(u.profilePic)} alt={u.username} />
                          ) : (
                            <UserIcon size={16} color="#888" />
                          )}
                        </div>
                        <span className="user-name">{u.username}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(u._id, u.username)}
                        disabled={u._id === currentUser._id}
                        title={u._id === currentUser._id ? "Cannot delete yourself" : "Delete User"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;