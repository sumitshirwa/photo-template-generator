import { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { getFrameDataURL, CANVAS_DIMENSIONS } from '../data/templates';

/* Responsive canvas size — clamps to CANVAS_DIMENSIONS on desktop */
const getResponsiveCanvasSize = () => {
  const width = window.innerWidth;
  if (width < 480) return Math.min(width - 40, CANVAS_DIMENSIONS);
  if (width < 768) return Math.min(width - 60, CANVAS_DIMENSIONS);
  return CANVAS_DIMENSIONS;
};

export function useCanvas() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const userImageRef = useRef(null);
  const templateObjRef = useRef(null);
  const currentTemplateIdRef = useRef(null);

  // Use refs for values needed inside resize handler to avoid stale closures
  const zoomRef = useRef(100);
  const canvasSizeRef = useRef(getResponsiveCanvasSize());

  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());

  // Keep refs in sync with state
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { canvasSizeRef.current = canvasSize; }, [canvasSize]);

  /* ────────── INIT ────────── */
  const initCanvas = useCallback((canvasEl) => {
    if (!canvasEl || fabricRef.current) return;

    const size = getResponsiveCanvasSize();

    const fc = new FabricCanvas(canvasEl, {
      width: size,
      height: size,
      backgroundColor: '#0f172a',
      selection: false,
      preserveObjectStacking: true,
    });

    canvasRef.current = canvasEl;
    fabricRef.current = fc;
    setCanvasSize(size);
    setIsReady(true);

    // Return cleanup for CanvasEditor to call on unmount
    return () => {
      fc.dispose();
      fabricRef.current = null;
    };
  }, []);

  /* ────────── RESPONSIVE RESIZE (debounced, runs only once) ────────── */
  useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const fc = fabricRef.current;
        if (!fc) return;

        const newSize = getResponsiveCanvasSize();

        fc.setDimensions({ width: newSize, height: newSize });
        setCanvasSize(newSize);

        // Rescale user image using ref for latest zoom
        if (userImageRef.current) {
          const img = userImageRef.current;
          const imgW = img.get('width') || img.width;
          const imgH = img.get('height') || img.height;
          const baseScale = Math.max(
            newSize / imgW,
            newSize / imgH,
          );
          img.set({
            scaleX: baseScale * (zoomRef.current / 100),
            scaleY: baseScale * (zoomRef.current / 100),
            left: newSize / 2,
            top: newSize / 2,
          });
        }

        // Rescale template overlay
        if (templateObjRef.current) {
          const frame = templateObjRef.current;
          const frameW = frame.get('width') || frame.width;
          const frameH = frame.get('height') || frame.height;
          frame.set({
            left: 0,
            top: 0,
            scaleX: newSize / frameW,
            scaleY: newSize / frameH,
          });
        }

        fc.renderAll();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // No dependencies — uses refs for latest values

  /* ────────── ADD USER IMAGE ────────── */
  const addUserImage = useCallback(async (dataURL) => {
    const fc = fabricRef.current;
    if (!fc) return;

    // Remove existing user image
    if (userImageRef.current) {
      fc.remove(userImageRef.current);
      userImageRef.current = null;
    }

    const img = await FabricImage.fromURL(dataURL);

    // Use Fabric getter for reliable dimensions
    const imgW = img.get('width') || img.width;
    const imgH = img.get('height') || img.height;
    const size = canvasSizeRef.current;

    const baseScale = Math.max(
      size / imgW,
      size / imgH,
    );

    img.set({
      scaleX: baseScale,
      scaleY: baseScale,
      left: size / 2,
      top: size / 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      cornerColor: '#8b5cf6',
      borderColor: '#8b5cf6',
      cornerSize: 10,
      transparentCorners: false,
    });

    userImageRef.current = img;

    fc.add(img);

    // Ensure template frame stays on top
    if (templateObjRef.current) {
      fc.bringObjectToFront(templateObjRef.current);
    }

    fc.setActiveObject(img);
    fc.renderAll();

    setHasImage(true);
    setZoom(100);
    setRotation(0);
  }, []);

  /* ────────── SET TEMPLATE ────────── */
  const setTemplate = useCallback(async (templateId) => {
    const fc = fabricRef.current;
    if (!fc) return;

    // Remove existing template
    if (templateObjRef.current) {
      fc.remove(templateObjRef.current);
      templateObjRef.current = null;
    }

    currentTemplateIdRef.current = templateId;

    const frameURL = getFrameDataURL(templateId);
    if (!frameURL) return;

    const frameImg = await FabricImage.fromURL(frameURL);

    // Use Fabric getter for reliable dimensions
    const frameW = frameImg.get('width') || frameImg.width;
    const frameH = frameImg.get('height') || frameImg.height;
    const size = canvasSizeRef.current;

    frameImg.set({
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      scaleX: size / frameW,
      scaleY: size / frameH,
      selectable: false,
      evented: false,
    });

    templateObjRef.current = frameImg;

    fc.add(frameImg);
    fc.bringObjectToFront(frameImg);
    fc.renderAll();
  }, []);

  /* ────────── ZOOM ────────── */
  const applyZoom = useCallback((value) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;
    if (!img || !fc) return;

    const imgW = img.get('width') || img.width;
    const imgH = img.get('height') || img.height;
    const size = canvasSizeRef.current;

    const baseScale = Math.max(
      size / imgW,
      size / imgH,
    );

    img.set({
      scaleX: baseScale * (value / 100),
      scaleY: baseScale * (value / 100),
    });

    fc.renderAll();
    setZoom(value);
  }, []);

  /* ────────── ROTATION ────────── */
  const applyRotation = useCallback((angle) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;
    if (!img || !fc) return;

    img.set({ angle });
    fc.renderAll();
    setRotation(angle);
  }, []);

  /* ────────── EXPORT (supports 'png' | 'jpeg') ────────── */
  const exportAsDataURL = useCallback((format = 'png') => {
    const fc = fabricRef.current;
    if (!fc) return null;

    // Hide selection handles before export
    fc.discardActiveObject();
    fc.renderAll();

    return fc.toDataURL({
      format,
      multiplier: format === 'jpeg' ? 1.2 : 1.5,
    });
  }, []);

  /* ────────── RESET ────────── */
  const reset = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (userImageRef.current) {
      fc.remove(userImageRef.current);
      userImageRef.current = null;
    }

    setHasImage(false);
    setZoom(100);
    setRotation(0);

    // Re-apply current template so the frame stays visible
    if (currentTemplateIdRef.current) {
      setTemplate(currentTemplateIdRef.current);
    }

    fc.renderAll();
  }, [setTemplate]);

  return {
    canvasRef,
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
  };
}