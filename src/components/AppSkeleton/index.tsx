import { useLayoutEffect, useState } from "react";

import { useMediaQueries } from "hooks/useMediaQuery";
import cn from "lib/cn";

import {
  MAIN_APP_WIDTH,
  MAIN_HEADER_HEIGHT,
  MIN_SIDEBAR_WIDTH,
} from "components/Layout/constants";

const AppSkeleton = () => {
  const isLg = useMediaQueries.LG();
  const [sidebarOpen, setSidebarOpen] = useState(isLg);

  useLayoutEffect(() => {
    setSidebarOpen(isLg);
  }, [isLg]);

  return (
    <div className="w-full h-full flex min-h-screen overflow-hidden">
      <div
        style={{
          width: sidebarOpen ? MIN_SIDEBAR_WIDTH : 0,
          visibility: sidebarOpen ? "visible" : "hidden",
          opacity: sidebarOpen ? 1 : 0,
          ["--pulse-duration" as any]: "4s",
        }}
        className={cn(
          "animate-pulse-low bg-background-700 relative flex flex-col h-screen border-r border-r-gray-800 flex-shrink-0"
        )}
      />
      <div
        style={{ minWidth: sidebarOpen ? MAIN_APP_WIDTH : "100%" }}
        className="flex flex-col"
      >
        <div
          style={{ height: MAIN_HEADER_HEIGHT }}
          className="bg-background-900 w-full flex items-center px-4 "
        />
        <div className="w-full animate-pulse-low bg-background-600 h-full " />
      </div>
    </div>
  );
};

export default AppSkeleton;
