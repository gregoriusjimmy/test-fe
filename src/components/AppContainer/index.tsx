import { ReactNode, useEffect } from "react";

import Loader from "components/Loader";

import { queryGetUser, queryGetUserTopics } from "api/users";
import { clearCookies, getCookies, setCookies } from "helpers/cookies";
import { useQueryWithCallbacks } from "lib/react-query";
import useAuthStore, { INIT_USER } from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { ECOOKIES_KEY } from "constants/index";

interface AppContainerProps {
  children: ReactNode;
}

// Initial Setup App
const AppContainer = ({ children }: AppContainerProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const onSetLoadingAuth = useAuthStore((state) => state.onSetLoading);
  const onSetUser = useAuthStore((state) => state.onSetUser);
  const onSetIsLogin = useAuthStore((state) => state.onSetIsLogin);
  const onSetTopics = useTopicStore((state) => state.onSetTopics);
  const rehydrateAllStore = () => {
    //  useThemeStore.persist.rehydrate();
    //  useWorkspaceStore.persist.rehydrate();
  };

  const { isLoading: isLoadingTopics } = useQueryWithCallbacks({
    queryKey: queryGetUserTopics._key(getCookies(ECOOKIES_KEY.USER_ID)),
    queryFn: () => queryGetUserTopics({ id: getCookies(ECOOKIES_KEY.USER_ID) }),
    enabled: isLogin,
    onError: () => {
      onSetTopics([]);
    },
    onSuccess: (data) => {
      onSetTopics(data);
    },
  });

  const { isLoading: isLoadingGetUser } = useQueryWithCallbacks({
    queryKey: queryGetUser._key(getCookies(ECOOKIES_KEY.USER_ID)),
    queryFn: () => queryGetUser({ id: getCookies(ECOOKIES_KEY.USER_ID) }),
    enabled:
      !!getCookies(ECOOKIES_KEY.ACCESS_TOKEN) &&
      !!getCookies(ECOOKIES_KEY.USER_ID),
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
        setCookies(ECOOKIES_KEY.USER_ID, String(data.id));
        return;
      }
      //TODO: handle subsription
      onSetIsLogin(true);
      setCookies(ECOOKIES_KEY.EMAIL, data.email);
    },
  });

  useEffect(() => {
    onSetLoadingAuth(isLoadingGetUser);
  }, [isLoadingGetUser, onSetLoadingAuth]);

  useEffect(() => {
    rehydrateAllStore();
  }, []);

  const isLoading = isLoadingGetUser || isLoadingTopics;

  if (isLoading) {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default AppContainer;
