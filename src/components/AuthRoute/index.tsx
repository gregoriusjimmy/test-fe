import { ReactNode, useEffect, useState } from "react";

import Loader from "components/Loader";

import { logout } from "helpers/logout";
import { useRenderStatus } from "helpers/useRenderStatus";
import useAuthStore from "store/AuthStore";

import { RouteType } from "types";

interface AuthRouteProps {
  route: RouteType;
  children: ReactNode;
}

const AuthRoute = ({ route, children }: AuthRouteProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const loadingAuth = useAuthStore((state) => state.loading);
  const [innerLoading, setInnerLoading] = useState(false);
  const busy = useRenderStatus(100);

  useEffect(() => {
    const handleLogout = async () => {
      setInnerLoading(true);
      await logout();
      setInnerLoading(false);
    };

    if (route.requiredAuth && !loadingAuth && !isLogin && !busy) {
      handleLogout();
    }
  }, [loadingAuth, isLogin, busy, route.requiredAuth]);

  if (!isLogin && route.requiredAuth) {
    return <Loader />;
  }

  if ((loadingAuth || innerLoading) && route.requiredAuth) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthRoute;
