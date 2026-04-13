import { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { getFrameDataURL, CANVAS_DIMENSIONS } from '../data/templates';

/* RESPONSIVE MOBILE SAFE SIZE */
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

  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());

  /* INIT */
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

    // Return cleanup for CanvasEditor to use
    return () => {
      fc.dispose();
      fabricRef.current = null;
    };
  }, []);

  /* MOBILE RESPONSIVE RESIZE */
  useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const fc = fabricRef.current;
        if (!fc) return;

        const newSize = getResponsiveCanvasSize();

        fc.setDimensions({
          width: newSize,
          height: newSize,
        });

        setCanvasSize(newSize);

        if (userImageRef.current) {
          const img = userImageRef.current;

          const baseScale = Math.max(
            newSize / img.width,
            newSize / img.height
          );

          img.set({
            scaleX: baseScale * (zoom / 100),
            scaleY: baseScale * (zoom / 100),
            left: newSize / 2,
            top: newSize / 2,
          });
        }

        if (templateObjRef.current) {
          const frame = templateObjRef.current;

          frame.set({
            scaleX: newSize / frame.width,
            scaleY: newSize / frame.height,
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
  }, [zoom]);

  /* USER IMAGE */
  const addUserImage = useCallback(async (dataURL) => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (userImageRef.current) {
      fc.remove(userImageRef.current);
    }

    const img = await FabricImage.fromURL(dataURL);

    const baseScale = Math.max(
      canvasSize / img.width,
      canvasSize / img.height
    );

    img.set({
      scaleX: baseScale,
      scaleY: baseScale,
      left: canvasSize / 2,
      top: canvasSize / 2,
      originX: 'center',
      originY: 'center',

      cornerColor: '#8b5cf6',
      borderColor: '#8b5cf6',

      cornerSize: 10,
      transparentCorners: false,
    });

    userImageRef.current = img;

    fc.add(img);

    if (templateObjRef.current) {
      fc.bringObjectToFront(templateObjRef.current);
    }

    fc.renderAll();

    setHasImage(true);
    setZoom(100);
    setRotation(0);
  }, [canvasSize]);

  /* TEMPLATE */
  const setTemplate = useCallback(async (templateId) => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (templateObjRef.current) {
      fc.remove(templateObjRef.current);
    }

    currentTemplateIdRef.current = templateId;

    const frameURL = getFrameDataURL(templateId);
    if (!frameURL) return;

    const frameImg = await FabricImage.fromURL(frameURL);

    frameImg.set({
      left: 0,
      top: 0,
      scaleX: canvasSize / frameImg.width,
      scaleY: canvasSize / frameImg.height,

      selectable: false,
      evented: false,
    });

    templateObjRef.current = frameImg;

    fc.add(frameImg);
    fc.bringObjectToFront(frameImg);

    fc.renderAll();
  }, [canvasSize]);

  /* ZOOM */
  const applyZoom = useCallback((value) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;

    if (!img || !fc) return;

    const baseScale = Math.max(
      canvasSize / img.width,
      canvasSize / img.height
    );

    img.set({
      scaleX: baseScale * (value / 100),
      scaleY: baseScale * (value / 100),
    });

    fc.renderAll();
    setZoom(value);
  }, [canvasSize]);

  /* ROTATION */
  const applyRotation = useCallback((angle) => {
    if (!userImageRef.current) return;

    userImageRef.current.set({ angle });

    fabricRef.current?.renderAll();

    setRotation(angle);
  }, []);

  /* EXPORT – accepts format ('png' | 'jpeg') */
  const exportAsDataURL = useCallback((format = 'png') => {
    const fc = fabricRef.current;
    if (!fc) return null;

    return fc.toDataURL({
      format: format,
      multiplier: format === 'jpeg' ? 1.2 : 1.5,
    });
  }, []);

  /* RESET */
  const reset = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    // Remove user image
    if (userImageRef.current) {
      fc.remove(userImageRef.current);
      userImageRef.current = null;
    }

    setHasImage(false);
    setZoom(100);
    setRotation(0);

    // Re-apply current template
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