import { MouseEvent, useCallback, useState } from "react";

export const useRightClick = () => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleRightClick = useCallback((event: MouseEvent<any>) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setIsContextMenuOpen(false);
    setContextMenuPosition(null);
  }, []);

  return {
    isContextMenuOpen,
    contextMenuPosition,
    onRightClick: handleRightClick,
    onCloseContextMenu: handleCloseContextMenu,
  };
};
