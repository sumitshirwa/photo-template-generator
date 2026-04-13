/**
 * ControlPanel - Bottom controls for zoom, rotate, export, download, share, and reset.
 * Glassmorphism styled with gradient buttons.
 */
import { useState, useCallback } from 'react';
import GradientButton from './ui/GradientButton';

const ControlPanel = ({
  hasImage,
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  onExport,
  onReset,
}) => {
  const [exportFormat, setExportFormat] = useState('png');
  const [showSuccess, setShowSuccess] = useState(false);

  /** Download the exported image */
  const handleDownload = useCallback(() => {
    const format = exportFormat === 'jpg' ? 'jpeg' : 'png';
    const dataURL = onExport(format);
    if (!dataURL) return;

    const link = document.createElement('a');
    link.download = `photo-template.${exportFormat}`;
    link.href = dataURL;
    link.click();

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, [onExport, exportFormat]);

  /** Share using Web Share API */
  const handleShare = useCallback(async () => {
    const dataURL = onExport('png');
    if (!dataURL) return;

    try {
      const res = await fetch(dataURL);
      const blob = await res.blob();
      const file = new File([blob], 'photo-template.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Photo Template Generator',
          text: 'Check out my framed photo!',
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Photo Template Generator',
          text: 'Check out my framed photo!',
        });
      } else {
        // Fallback: show user-friendly message instead of copying raw data URL
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
        alert('Sharing is not supported on this browser. Please use the Download button instead.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  }, [onExport]);

  return (
    <div className="glass p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      {/* Sliders row */}
      {hasImage && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
          {/* Zoom slider */}
          <div className="flex-1">
            <label className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                🔍 Zoom
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>
                {zoom}%
              </span>
            </label>
            <input
              type="range"
              min="20"
              max="300"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="slider-custom"
            />
          </div>
          {/* Rotation slider */}
          <div className="flex-1">
            <label className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                🔄 Rotate
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>
                {rotation}°
              </span>
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotation}
              onChange={(e) => onRotationChange(Number(e.target.value))}
              className="slider-custom"
            />
          </div>
        </div>
      )}

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Format toggle */}
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'rgba(0,0,0,0.04)' }}>
          {['png', 'jpg'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setExportFormat(fmt)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md uppercase transition-all duration-200 ${
                exportFormat === fmt
                  ? 'text-white'
                  : 'hover:bg-white/10'
              }`}
              style={
                exportFormat === fmt
                  ? { background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Action buttons */}
        <GradientButton
          variant="secondary"
          icon="🔄"
          onClick={onReset}
          disabled={!hasImage}
        >
          Reset
        </GradientButton>

        <GradientButton
          variant="primary"
          icon="⬇️"
          onClick={handleDownload}
          disabled={!hasImage}
        >
          Download
        </GradientButton>

        <GradientButton
          variant="secondary"
          icon="🔗"
          onClick={handleShare}
          disabled={!hasImage}
        >
          Share
        </GradientButton>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="mt-3 text-center animate-fade-in">
          <span className="text-xs font-medium px-4 py-2 rounded-full"
                style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            ✅ Done! Image saved successfully.
          </span>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
