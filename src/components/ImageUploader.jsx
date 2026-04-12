/**
 * ImageUploader - Drag-and-drop upload zone with file input fallback.
 * Glassmorphism-styled with animated border on drag-over.
 */
import React, { useRef, useState, useCallback } from 'react';
import GradientButton from './ui/GradientButton';

const ImageUploader = ({ onImageUpload, hasImage }) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      handleFile(file);
      // Reset so user can upload same file again
      e.target.value = '';
    },
    [handleFile]
  );

  if (hasImage) {
    return (
      <div className="flex items-center gap-3 animate-fade-in">
        <GradientButton
          variant="secondary"
          icon="📷"
          onClick={() => inputRef.current?.click()}
          className="text-xs"
        >
          Change Photo
        </GradientButton>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={`upload-zone flex flex-col items-center justify-center gap-4 p-8 sm:p-12 text-center animate-fade-in-up ${
        isDragOver ? 'drag-over' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      style={{ animationDelay: '0.2s' }}
    >
      {/* Upload icon */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
           style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Drop your photo here
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          or click to browse &middot; PNG, JPG, WEBP
        </p>
      </div>
      <GradientButton icon="📁" className="text-sm">
        Upload Image
      </GradientButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
