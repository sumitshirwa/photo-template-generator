/**
 * Navbar - App header with logo and title.
 * Glassmorphism-styled sticky top bar.
 */
import React from 'react';

const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center gap-3 animate-fade-in-up"
         style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      {/* Logo Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #1e293b, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Photo Template Generator
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
          Create stunning framed photos
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
