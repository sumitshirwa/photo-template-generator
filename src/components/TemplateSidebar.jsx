/**
 * TemplateSidebar - Horizontal scrolling gallery of template frame thumbnails.
 * Responsive: horizontal on mobile, vertical sidebar on desktop.
 */
import React, { useEffect, useState } from 'react';
import { templates, getThumbnailDataURL } from '../data/templates';

const TemplateSidebar = ({ activeTemplate, onSelectTemplate }) => {
  const [thumbnails, setThumbnails] = useState({});

  // Generate thumbnails on mount
  useEffect(() => {
    const thumbs = {};
    templates.forEach((tpl) => {
      thumbs[tpl.id] = getThumbnailDataURL(tpl.id);
    });
    setThumbnails(thumbs);
  }, []);

  return (
    <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-sm font-semibold mb-3 px-1 flex items-center gap-2"
          style={{ color: 'var(--text-secondary)' }}>
        <span>🎨</span>
        <span>Templates</span>
      </h2>
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 stagger-children">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelectTemplate(tpl.id)}
            className={`template-card flex-shrink-0 p-2.5 flex flex-col items-center gap-2 min-w-[100px] lg:min-w-0 ${
              activeTemplate === tpl.id ? 'active' : ''
            }`}
            title={tpl.name}
          >
            <div className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-lg overflow-hidden flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
              {thumbnails[tpl.id] ? (
                <img
                  src={thumbnails[tpl.id]}
                  alt={tpl.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              ) : (
                <span className="text-2xl">{tpl.icon}</span>
              )}
            </div>
            <span className="text-xs font-medium" style={{ color: activeTemplate === tpl.id ? '#a5b4fc' : 'var(--text-secondary)' }}>
              {tpl.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSidebar;
