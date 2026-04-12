/**
 * CanvasEditor - Main canvas editing area.
 * Renders the Fabric.js canvas inside a glassmorphism container
 * with responsive sizing.
 */
import React, { useEffect, useRef, useCallback } from 'react';

const CanvasEditor = ({ initCanvas }) => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (canvasElRef.current && !initializedRef.current) {
      initializedRef.current = true;
      initCanvas(canvasElRef.current);
    }
  }, [initCanvas]);

  return (
    <div
      ref={containerRef}
      className="canvas-container-wrapper flex items-center justify-center p-2 sm:p-4 animate-fade-in-up"
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
