import React from 'react';
import { Search } from 'lucide-react';

const SubNav = () => {
  return (
    <div className="sub-header">
      <div className="sub-nav-links"></div>
      
      <div className="search-container">
        <Search className="search-icon" />
        <input type="text" className="search-input" placeholder="Search your library..." />
      </div>
    </div>
  );
};

export default SubNav;