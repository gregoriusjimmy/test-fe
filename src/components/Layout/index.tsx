import React, { ReactNode, useLayoutEffect } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { useMediaQueries } from "hooks";
import useLayoutStore from "store/LayoutStore";

import { MAIN_APP_WIDTH } from "./constants";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const showBaseLayout = useLayoutStore((state) => state.showBaseLayout);
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const onSetSidebarOpen = useLayoutStore((state) => state.onSetSidebarOpen);

  const isLg = useMediaQueries.LG();

  const handleClickMenu = () => {
    onSetSidebarOpen(!sidebarOpen);
  };

  useLayoutEffect(() => {
    onSetSidebarOpen(isLg);
  }, [isLg, onSetSidebarOpen]);

  if (!showBaseLayout) return <>{children}</>;

  return (
    <div className="w-full h-full flex min-h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div
        style={{ minWidth: sidebarOpen ? MAIN_APP_WIDTH : "100%" }}
        className="flex flex-col"
      >
        <Header onClickMenu={handleClickMenu} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
