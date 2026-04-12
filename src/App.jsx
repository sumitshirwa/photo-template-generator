/**
 * App - Root application component.
 * Composes all components: Animated background, Navbar, TemplateSidebar,
 * CanvasEditor, ImageUploader, ControlPanel, and Footer.
 */
import React, { useCallback, useEffect, useState } from 'react';
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

  // Set initial template when canvas is ready
  useEffect(() => {
    if (isReady) {
      setTemplate(activeTemplate);
    }
  }, [isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Handle template selection */
  const handleSelectTemplate = useCallback(
    (templateId) => {
      setActiveTemplate(templateId);
      setTemplate(templateId);
    },
    [setTemplate]
  );

  /** Handle image upload */
  const handleImageUpload = useCallback(
    (dataURL) => {
      addUserImage(dataURL);
    },
    [addUserImage]
  );

  /** Handle reset */
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated aurora background */}
      <AnimatedBackground />

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main editor area */}
        <main className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* Left sidebar - Template selection */}
          <aside className="lg:w-[140px] flex-shrink-0">
            <div className="glass p-3 sm:p-4 lg:sticky lg:top-20">
              <TemplateSidebar
                activeTemplate={activeTemplate}
                onSelectTemplate={handleSelectTemplate}
              />
            </div>
          </aside>

          {/* Center - Canvas and controls */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0">
            {/* Upload zone (shows when no image) or change photo button */}
            <ImageUploader
              onImageUpload={handleImageUpload}
              hasImage={hasImage}
            />

            {/* Canvas editor */}
            <CanvasEditor initCanvas={initCanvas} />

            {/* Control panel */}
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

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
