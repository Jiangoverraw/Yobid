import { useEffect, useRef } from 'react';
import { useAvatarCropStore } from './useAvatarCropStore';

/**
 * Custom hook to manage avatar upload, crop, zoom and pan logic using Zustand.
 */
export function useAvatarCrop(initialAvatar = '') {
  const store = useAvatarCropStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialAvatar && !store.avatarVal) {
      store.setAvatarVal(initialAvatar);
    }
  }, [initialAvatar]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      store.resetCropState(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (clientX, clientY) => {
    store.setIsDragging(true);
    store.setDragStart({ x: clientX - store.panX, y: clientY - store.panY });
  };

  const handleDragMove = (clientX, clientY) => {
    if (!store.isDragging) return;
    store.setPanX(clientX - store.dragStart.x);
    store.setPanY(clientY - store.dragStart.y);
  };

  const handleDragEnd = () => store.setIsDragging(false);

  const handleMouseDown = (e) => { e.preventDefault(); handleDragStart(e.clientX, e.clientY); };
  const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleDragEnd();

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 1) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = () => handleDragEnd();

  const handleApplyCrop = () => {
    const img = new Image();
    img.src = store.cropImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 160, 160);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const aspect = iw / ih;
      let dw, dh;
      if (aspect > 1) { dh = 160; dw = 160 * aspect; }
      else { dw = 160; dh = 160 / aspect; }

      const cx = (160 - dw) / 2;
      const cy = (160 - dh) / 2;

      ctx.translate(160 / 2, 160 / 2);
      ctx.translate(store.panX, store.panY);
      ctx.scale(store.zoom, store.zoom);
      ctx.translate(-160 / 2, -160 / 2);
      ctx.drawImage(img, cx, cy, dw, dh);

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      store.setAvatarVal(croppedBase64);
      store.setShowCropModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  };

  return {
    avatarVal: store.avatarVal,
    setAvatarVal: store.setAvatarVal,
    showCropModal: store.showCropModal,
    setShowCropModal: store.setShowCropModal,
    cropImageSrc: store.cropImageSrc,
    zoom: store.zoom,
    setZoom: store.setZoom,
    panX: store.panX,
    panY: store.panY,
    fileInputRef,
    handleAvatarFileChange,
    handleMouseDown, handleMouseMove, handleMouseUp,
    handleTouchStart, handleTouchMove, handleTouchEnd,
    handleApplyCrop,
  };
}
