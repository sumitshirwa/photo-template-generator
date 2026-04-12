/**
 * GradientButton - Premium gradient button with shine effect, hover lift, and optional icon.
 */
import React from 'react';

const GradientButton = ({ children, onClick, icon, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseClass = variant === 'primary' ? 'btn-gradient' : 'btn-glass';

  return (
    <button
      className={`${baseClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default GradientButton;
