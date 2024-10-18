import { ReactNode, useEffect } from "react";
import { useQuery } from "react-query";

import Loader from "components/Loader";

import { queryGetUser } from "api/users";
import { clearCookies, getCookies, setCookies } from "helpers/cookies";
import useAuthStore, { INIT_USER } from "store/AuthStore";
import useThemeStore from "store/ThemeStore";

import { ECOOKIES_KEY } from "constants/index";

interface AppContainerProps {
  children: ReactNode;
}

// Initial Setup App
const AppContainer = ({ children }: AppContainerProps) => {
  const loadingTheme = useThemeStore((state) => state.loading);
  const loadingAuth = useAuthStore((state) => state.loading);
  const onSetLoadingAuth = useAuthStore((state) => state.onSetLoading);
  const onSetUser = useAuthStore((state) => state.onSetUser);
  const onSetIsLogin = useAuthStore((state) => state.onSetIsLogin);

  const rehydrateAllStore = () => {
    //  useThemeStore.persist.rehydrate();
    //  useWorkspaceStore.persist.rehydrate();
  };

  const { isLoading: isLoadingGetUser } = useQuery(
    queryGetUser._key,
    queryGetUser,
    {
      enabled: !!getCookies(ECOOKIES_KEY.ACCESS_TOKEN),
      onError: () => {
        onSetUser(INIT_USER);
        onSetIsLogin(false);
        clearCookies();
      },
      onSuccess: (data) => {
        onSetUser(data);
        const userIdCookie = getCookies(ECOOKIES_KEY.USER_ID);
        if (!userIdCookie || userIdCookie !== String(data.id)) {
          //  resetAllStores();
          window.location.reload();
        }
        onSetIsLogin(data.subscriptionActive);
        setCookies(ECOOKIES_KEY.EMAIL, data.email);
        setCookies(ECOOKIES_KEY.USER_ID, String(data.id));
      },
    }
  );

  useEffect(() => {
    onSetLoadingAuth(isLoadingGetUser);
  }, [isLoadingGetUser, onSetLoadingAuth]);

  useEffect(() => {
    rehydrateAllStore();
  }, []);

  const isLoading = loadingTheme || loadingAuth;

  if (isLoading) {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default AppContainer;
