import { useCallback, useEffect, useRef, useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TemplateSidebar from './components/TemplateSidebar';
import CanvasEditor from './components/CanvasEditor';
import ControlPanel from './components/ControlPanel';
import ImageUploader from './components/ImageUploader';
import { useCanvas } from './hooks/useCanvas';
import { templates } from './data/templates';

const App = () => {
  const {
    initCanvas,
    isReady,
    hasImage,
    zoom,
    rotation,
    addUserImage,
    setTemplate,
    applyZoom,
    applyRotation,
    exportAsDataURL,
    reset,
  } = useCanvas();

  const [activeTemplate, setActiveTemplate] = useState(templates[0].id);

  useEffect(() => {
    if (isReady) {
      setTemplate(activeTemplate);
    }
    // Only run when canvas becomes ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  /* 3D PARALLAX - uses ref-based approach */
  const mainRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleMouseMove = (e) => {
      const cards = mainEl.querySelectorAll('.glass');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top || e.clientY > rect.bottom
        ) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `
          perspective(1200px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.015)
        `;
      });
    };

    const handleMouseLeave = () => {
      const cards = mainEl.querySelectorAll('.glass');
      cards.forEach((card) => {
        card.style.transform = '';
      });
    };

    mainEl.addEventListener('mousemove', handleMouseMove);
    mainEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mainEl.removeEventListener('mousemove', handleMouseMove);
      mainEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSelectTemplate = useCallback(
    (templateId) => {
      setActiveTemplate(templateId);
      setTemplate(templateId);
    },
    [setTemplate]
  );

  const handleImageUpload = useCallback(
    (dataURL) => {
      addUserImage(dataURL);
    },
    [addUserImage]
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main
          ref={mainRef}
          className="no-hover-lift flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full"
        >
          {/* Sidebar */}
          <aside className="lg:w-[160px] flex-shrink-0">
            <div className="glass p-3 sm:p-4 lg:sticky lg:top-20">
              <TemplateSidebar
                activeTemplate={activeTemplate}
                onSelectTemplate={handleSelectTemplate}
              />
            </div>
          </aside>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0">

            {/* Upload */}
            <ImageUploader
              onImageUpload={handleImageUpload}
              hasImage={hasImage}
            />

            {/* Canvas */}
            <CanvasEditor initCanvas={initCanvas} />

            {/* Controls */}
            <ControlPanel
              hasImage={hasImage}
              zoom={zoom}
              rotation={rotation}
              onZoomChange={applyZoom}
              onRotationChange={applyRotation}
              onExport={exportAsDataURL}
              onReset={handleReset}
            />

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;