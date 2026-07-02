import { useState, useRef } from 'react';

/**
 * Custom hook to manage avatar upload, crop, zoom and pan logic.
 */
export function useAvatarCrop(initialAvatar = '') {
  const [avatarVal, setAvatarVal] = useState(initialAvatar);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result);
      setZoom(1.0);
      setPanX(0);
      setPanY(0);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX - panX, y: clientY - panY });
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;
    setPanX(clientX - dragStart.x);
    setPanY(clientY - dragStart.y);
  };

  const handleDragEnd = () => setIsDragging(false);

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
    img.src = cropImageSrc;
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
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-160 / 2, -160 / 2);
      ctx.drawImage(img, cx, cy, dw, dh);

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      setAvatarVal(croppedBase64);
      setShowCropModal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  };

  return {
    avatarVal, setAvatarVal,
    showCropModal, setShowCropModal,
    cropImageSrc, zoom, setZoom,
    panX, panY,
    fileInputRef,
    handleAvatarFileChange,
    handleMouseDown, handleMouseMove, handleMouseUp,
    handleTouchStart, handleTouchMove, handleTouchEnd,
    handleApplyCrop,
  };
}
