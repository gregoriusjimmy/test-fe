import { ReactNode, useLayoutEffect } from "react";

import useLayoutStore from "store/LayoutStore";

import { RouteType } from "types";

interface LayoutRouteProps {
  route: RouteType;
  children: ReactNode;
}

const LayoutRoute = ({ route, children }: LayoutRouteProps) => {
  const onSetShowBaseLayout = useLayoutStore(
    (state) => state.onSetShowBaseLayout
  );

  useLayoutEffect(() => {
    onSetShowBaseLayout(!route.withoutLayout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.withoutLayout]);

  return <>{children}</>;
};

export default LayoutRoute;
