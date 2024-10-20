import React, { ReactNode, useEffect, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { useMediaQueries } from "hooks";
import useAuthStore from "store/AuthStore";
import useLayoutStore from "store/LayoutStore";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const showBaseLayout = useLayoutStore((state) => state.showBaseLayout);
  const isLogin = useAuthStore((state) => state.isLogin);
  const isLg = useMediaQueries.LG();
  const [sidebarOpen, setSidebarOpen] = useState(isLg);

  const handleClickMenu = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleClickNewChat = () => {
    //empty
  };

  useEffect(() => {
    setSidebarOpen(isLg);
  }, [isLg]);

  useEffect(()=>{
    console.log(showBaseLayout)
  })
  
  if (!showBaseLayout) return <>{children}</>;

  
  return (
    <div className="w-full h-full flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col w-full">
        <Header
          onClickMenu={handleClickMenu}
          onClickNewChat={handleClickNewChat}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;
