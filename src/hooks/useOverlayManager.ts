import { useState } from "react";

export const useOverlayManager = () => {
  const [openOverlays, setOpenOverlays] = useState<{ [key: string]: boolean }>(
    {}
  );

  const onOpenOverlay = (id: string) => {
    setOpenOverlays((prev) => ({ ...prev, [id]: true }));
  };

  const onCloseOverlay = (id: string) => {
    setOpenOverlays((prev) => ({ ...prev, [id]: false }));
  };

  const isOverlayOpen = (id: string) => openOverlays[id] || false;

  return {
    onOpenOverlay,
    onCloseOverlay,
    isOverlayOpen,
  };
};
