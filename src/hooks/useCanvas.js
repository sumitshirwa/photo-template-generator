/**
 * useCanvas - Custom hook that encapsulates all Fabric.js canvas logic.
 *
 * Manages:
 * - Canvas initialization and cleanup
 * - User image (draggable, scalable, rotatable)
 * - Template frame overlay (locked on top)
 * - Zoom, rotation, export, and reset operations
 */
import { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage, filters } from 'fabric';
import { getFrameDataURL, CANVAS_DIMENSIONS } from '../data/templates';

const CANVAS_SIZE = CANVAS_DIMENSIONS; // 600

export function useCanvas() {
  const canvasRef = useRef(null);         // <canvas> DOM element
  const fabricRef = useRef(null);         // Fabric.Canvas instance
  const userImageRef = useRef(null);      // Fabric image object for user photo
  const templateObjRef = useRef(null);    // Fabric image object for template frame
  const currentTemplateRef = useRef(null);// Current template ID

  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  /**
   * Initialize the Fabric canvas.
   */
  const initCanvas = useCallback((canvasEl) => {
    if (!canvasEl || fabricRef.current) return;
    canvasRef.current = canvasEl;

    const fc = new FabricCanvas(canvasEl, {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      backgroundColor: '#111118',
      selection: false,
      preserveObjectStacking: true,
    });

    fabricRef.current = fc;
    setIsReady(true);

    return () => {
      fc.dispose();
      fabricRef.current = null;
      setIsReady(false);
    };
  }, []);

  /**
   * Add or replace the user image on the canvas.
   */
  const addUserImage = useCallback(async (dataURL) => {
    const fc = fabricRef.current;
    if (!fc) return;

    // Remove existing user image
    if (userImageRef.current) {
      fc.remove(userImageRef.current);
      userImageRef.current = null;
    }

    try {
      const img = await FabricImage.fromURL(dataURL, { crossOrigin: 'anonymous' });

      // Scale the image to fit canvas
      const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: CANVAS_SIZE / 2,
        top: CANVAS_SIZE / 2,
        originX: 'center',
        originY: 'center',
        // User can interact with this
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockScalingFlip: true,
        // Custom styling for controls
        cornerColor: '#6366f1',
        cornerStrokeColor: '#fff',
        cornerSize: 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#6366f1',
        borderScaleFactor: 2,
      });

      userImageRef.current = img;
      fc.add(img);

      // Ensure template stays on top
      if (templateObjRef.current) {
        fc.bringObjectToFront(templateObjRef.current);
      }

      fc.setActiveObject(img);
      fc.requestRenderAll();
      setHasImage(true);
      setZoom(100);
      setRotation(0);
    } catch (err) {
      console.error('Failed to load user image:', err);
    }
  }, []);

  /**
   * Set or change the template frame overlay.
   */
  const setTemplate = useCallback(async (templateId) => {
    const fc = fabricRef.current;
    if (!fc) return;

    currentTemplateRef.current = templateId;

    // Remove existing template
    if (templateObjRef.current) {
      fc.remove(templateObjRef.current);
      templateObjRef.current = null;
    }

    const frameDataURL = getFrameDataURL(templateId);
    if (!frameDataURL) return;

    try {
      const frameImg = await FabricImage.fromURL(frameDataURL, { crossOrigin: 'anonymous' });

      frameImg.set({
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        scaleX: CANVAS_SIZE / frameImg.width,
        scaleY: CANVAS_SIZE / frameImg.height,
        // LOCKED - user cannot interact
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hoverCursor: 'default',
      });

      templateObjRef.current = frameImg;
      fc.add(frameImg);
      fc.bringObjectToFront(frameImg);
      fc.requestRenderAll();
    } catch (err) {
      console.error('Failed to load template frame:', err);
    }
  }, []);

  /**
   * Apply zoom level to the user image.
   */
  const applyZoom = useCallback((value) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;
    if (!img || !fc) return;

    const zoomFactor = value / 100;
    const baseScale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
    img.set({
      scaleX: baseScale * zoomFactor,
      scaleY: baseScale * zoomFactor,
    });
    img.setCoords();
    fc.requestRenderAll();
    setZoom(value);
  }, []);

  /**
   * Apply rotation to the user image.
   */
  const applyRotation = useCallback((angle) => {
    const img = userImageRef.current;
    const fc = fabricRef.current;
    if (!img || !fc) return;

    img.set({ angle: angle });
    img.setCoords();
    fc.requestRenderAll();
    setRotation(angle);
  }, []);

  /**
   * Export the canvas as a data URL.
   */
  const exportAsDataURL = useCallback((format = 'png') => {
    const fc = fabricRef.current;
    if (!fc) return null;

    // Deselect active object to hide controls in export
    fc.discardActiveObject();
    fc.requestRenderAll();

    const dataURL = fc.toDataURL({
      format: format,
      quality: format === 'jpeg' ? 0.92 : 1,
      multiplier: 2, // 2x resolution
    });

    // Re-select the user image if present
    if (userImageRef.current) {
      fc.setActiveObject(userImageRef.current);
      fc.requestRenderAll();
    }

    return dataURL;
  }, []);

  /**
   * Reset the canvas to initial state.
   */
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
    fc.requestRenderAll();
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
