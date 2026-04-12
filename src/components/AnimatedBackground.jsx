/**
 * AnimatedBackground - Renders floating gradient aurora blobs
 * that create a cinematic ambient glow effect behind all content.
 */
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
    </div>
  );
};

export default AnimatedBackground;
