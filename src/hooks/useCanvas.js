import { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { getFrameDataURL } from '../data/templates';

/* RESPONSIVE CANVAS SIZE FUNCTION */
const getResponsiveCanvasSize = () => {
  if (window.innerWidth < 480) return 280;
  if (window.innerWidth < 768) return 350;
  return 600;
};

export function useCanvas() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const userImageRef = useRef(null);
  const templateObjRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const [canvasSize, setCanvasSize] = useState(getResponsiveCanvasSize());

  /* INITIALIZE CANVAS */
  const initCanvas = useCallback((canvasEl) => {
    if (!canvasEl || fabricRef.current) return;

    canvasRef.current = canvasEl;

    const size = getResponsiveCanvasSize();

    const fc = new FabricCanvas(canvasEl, {
      width: size,
      height: size,
      backgroundColor: '#111118',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricRef.current = fc;
    setCanvasSize(size);
    setIsReady(true);

    return () => {
      fc.dispose();
      fabricRef.current = null;
      setIsReady(false);
    };
  }, []);

  /* HANDLE WINDOW RESIZE */
  useEffect(() => {
    const handleResize = () => {
      const fc = fabricRef.current;
      if (!fc) return;

      const newSize = getResponsiveCanvasSize();

      fc.setWidth(newSize);
      fc.setHeight(newSize);

      setCanvasSize(newSize);

      /* RESCALE USER IMAGE */
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

      /* RESCALE TEMPLATE */
      if (templateObjRef.current) {
        const frame = templateObjRef.current;

        frame.set({
          scaleX: newSize / frame.width,
          scaleY: newSize / frame.height,
        });
      }

      fc.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [zoom]);

  /* ADD USER IMAGE */
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
      selectable: true,
      cornerColor: '#6366f1',
      borderColor: '#6366f1',
    });

    userImageRef.current = img;

    fc.add(img);

    if (templateObjRef.current) {
      fc.bringObjectToFront(templateObjRef.current);
    }

    fc.setActiveObject(img);

    fc.renderAll();

    setHasImage(true);
    setZoom(100);
    setRotation(0);
  }, [canvasSize]);

  /* SET TEMPLATE */
  const setTemplate = useCallback(async (templateId) => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (templateObjRef.current) {
      fc.remove(templateObjRef.current);
    }

    const frameURL = getFrameDataURL(templateId);

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

  /* APPLY ZOOM */
  const applyZoom = useCallback((value) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;

    if (!img || !fc) return;

    const zoomFactor = value / 100;

    const baseScale = Math.max(
      canvasSize / img.width,
      canvasSize / img.height
    );

    img.set({
      scaleX: baseScale * zoomFactor,
      scaleY: baseScale * zoomFactor,
    });

    fc.renderAll();

    setZoom(value);
  }, [canvasSize]);

  /* APPLY ROTATION */
  const applyRotation = useCallback((angle) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;

    if (!img || !fc) return;

    img.set({
      angle: angle,
    });

    fc.renderAll();

    setRotation(angle);
  }, []);

  /* EXPORT */
  const exportAsDataURL = useCallback(() => {
    const fc = fabricRef.current;

    if (!fc) return null;

    fc.discardActiveObject();

    return fc.toDataURL({
      format: 'png',
      multiplier: 2,
    });
  }, []);

  /* RESET */
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

    fc.renderAll();
  }, []);

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
