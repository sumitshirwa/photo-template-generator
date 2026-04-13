
/**
 * Navbar - App header with logo and title.
 * Glassmorphism-styled sticky top bar.
 */
import { memo } from 'react';

const Navbar = memo(() => {
  return (
    <nav
      className="glass sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center gap-3 animate-fade-in-up"
      style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none'
      }}
    >

      {/* Your Custom Logo */}
      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
        <img
          src="https://i.postimg.cc/C5k8ZfMp/IMG-20250910-134440-951.webp"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col">
        <h1
          className="text-lg sm:text-xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #1e293b, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Photo Template Generator
        </h1>

        <p
          className="text-xs hidden sm:block"
          style={{ color: 'var(--text-muted)' }}
        >
          Create stunning framed photos
        </p>
      </div>

    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;