import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AdminZone = () => {
  return (
    <section className="admin-zone">
      <h2 className="admin-title">
        <ShieldAlert size={24} color="#ffffff" />
        Platform Administration
      </h2>
      <p style={{ color: '#aaa', marginBottom: '24px', fontSize: '14px' }}>
        System overview and management tools. Visible only to authorized administrators.
      </p>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="admin-btn primary">Manage Users</button>
        <button className="admin-btn">Global Game Database</button>
        <button className="admin-btn">System Logs</button>
      </div>
    </section>
  );
};

export default AdminZone;