/**
 * CanvasEditor - Main canvas editing area.
 * Renders the Fabric.js canvas inside a glassmorphism container
 * with responsive sizing.
 */
import { memo, useEffect, useRef } from 'react';

const CanvasEditor = memo(({ initCanvas }) => {
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
      <div className="canvas-inner-wrapper">
        <canvas
          ref={canvasElRef}
          id="photo-canvas"
        />
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';

export default CanvasEditor;
