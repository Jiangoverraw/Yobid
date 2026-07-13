import { create } from 'zustand';

export const useAvatarCropStore = create((set, get) => ({
  avatarVal: '',
  showCropModal: false,
  cropImageSrc: '',
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStart: { x: 0, y: 0 },

  setAvatarVal: (avatarVal) => set({ avatarVal }),
  setShowCropModal: (showCropModal) => set({ showCropModal }),
  setCropImageSrc: (cropImageSrc) => set({ cropImageSrc }),
  setZoom: (zoom) => set({ zoom: typeof zoom === 'function' ? zoom(get().zoom) : zoom }),
  setPanX: (panX) => set({ panX: typeof panX === 'function' ? panX(get().panX) : panX }),
  setPanY: (panY) => set({ panY: typeof panY === 'function' ? panY(get().panY) : panY }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDragStart: (dragStart) => set({ dragStart }),

  resetCropState: (src) => set({
    cropImageSrc: src,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    showCropModal: true
  })
}));
