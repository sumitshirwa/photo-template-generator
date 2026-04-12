/**
 * GlassCard - Reusable glassmorphism container with optional hover effects.
 */
import React from 'react';

const GlassCard = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`glass ${hover ? 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
