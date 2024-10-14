import { ReactNode, useEffect } from "react";

import Loader from "components/Loader";

import useAuthStore from "store/AuthStore";
import useThemeStore from "store/ThemeStore";
import useWorkspaceStore from "store/WorkspaceStore";

interface AppContainerProps {
  children: ReactNode;
}

// Initial Setup App
const AppContainer = ({ children }: AppContainerProps) => {
  const loadingTheme = useThemeStore((state) => state.loading);
  const getUserData = useAuthStore((state) => state.getUserData);
  const isLoadingLogin = useAuthStore((state) => state.loading);
  const isLogin = useAuthStore((state) => state.isLogin);

  const onSetWorkspaceList = useWorkspaceStore(
    (state) => state.onSetWorkspaceList
  );

  useEffect(() => {
    // getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = loadingTheme || isLoadingLogin;

  if (isLoading) {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default AppContainer;
