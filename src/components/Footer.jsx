/**
 * Footer - Minimal professional footer.
 */
import { memo } from 'react';

const YEAR = new Date().getFullYear();

const Footer = memo(() => {
  return (
    <footer className="mt-auto py-6 px-4 text-center animate-fade-in" style={{ color: 'var(--text-muted)' }}>
      <div className="glass-subtle inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium">
        <span>✨</span>
        <span>Photo Template Generator &copy; {YEAR}</span>
        <span className="mx-1 opacity-30">|</span>
        <span>Crafted with precision by sumit shirwa</span>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
