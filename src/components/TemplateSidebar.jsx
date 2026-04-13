/**
 * TemplateSidebar - Horizontal scrolling gallery of template frame thumbnails.
 * Responsive: horizontal on mobile, vertical sidebar on desktop.
 */
import { memo } from 'react';
import { templates, getFrameDataURL } from '../data/templates';

const TemplateSidebar = memo(({ activeTemplate, onSelectTemplate }) => {
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
            <div className="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] rounded-lg overflow-hidden flex items-center justify-center"
                 style={{ background: 'rgba(0,0,0,0.03)' }}>
              <img
                src={getFrameDataURL(tpl.id)}
                alt={tpl.name}
                className="w-full h-full object-contain"
                draggable={false}
                loading="lazy"
              />
            </div>
            <span className="text-xs font-medium" style={{ color: activeTemplate === tpl.id ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
              {tpl.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

TemplateSidebar.displayName = 'TemplateSidebar';

export default TemplateSidebar;
