import React from 'react';
import { Play } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section 
      className="hero-banner"
      style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.2) 100%), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&grayscale=true')` }}
    >
      <div className="hero-content">
        <div className="hero-tag">Continue Playing</div>
        <h1 className="hero-title">CYBERPUNK 2077</h1>
        <div className="hero-stats">
          <span>Status: Active</span>
          <span>•</span>
          <span>Progress: 65%</span>
          <span>•</span>
          <span>Last Played: Today</span>
        </div>
        <button className="hero-btn">
          <Play size={18} fill="#000" /> Resume Tracking
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;