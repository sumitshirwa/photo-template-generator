/**
 * CanvasEditor - Main canvas editing area.
 * Renders the Fabric.js canvas inside a glassmorphism container
 * with responsive sizing.
 */
import React, { useEffect, useRef } from 'react';

const CanvasEditor = ({ initCanvas }) => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);

  useEffect(() => {
    if (!canvasElRef.current) return;

    const cleanup = initCanvas(canvasElRef.current);

    // Return cleanup so Fabric.js canvas is disposed on unmount
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initCanvas]);

  return (
    <div
      ref={containerRef}
      className="canvas-container-wrapper flex items-center justify-center animate-fade-in-up"
      style={{ animationDelay: '0.15s' }}
    >
      <div className="relative" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <canvas
          ref={canvasElRef}
          id="photo-canvas"
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
