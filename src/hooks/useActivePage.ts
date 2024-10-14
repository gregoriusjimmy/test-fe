import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { routePaths } from "routes/constants";

type RoutePath = {
  root: string;
  _name: string;
  _parent?: string;
  [key: string]: RoutePath | string | undefined;
};

type TRouteInfo = {
  currentName: string | null;
  parentName: string | null;
};

const matchStaticRoute = (
  path: string,
  route: RoutePath
): TRouteInfo | null => {
  if (route.root === path) {
    return {
      currentName: route._name || null,
      parentName: route._parent || null,
    };
  }
  return null;
};

const matchDynamicRoute = (
  path: string,
  route: RoutePath
): TRouteInfo | null => {
  const paramPattern = route.root.replace(/:\w+/g, "([^/]+)");
  const regex = new RegExp(`^${paramPattern}$`);

  if (regex.test(path)) {
    return {
      currentName: route._name || null,
      parentName: route._parent || null,
    };
  }
  return null;
};

const findRouteInfo = (path: string, routes: RoutePath): TRouteInfo => {
  for (const value of Object.values(routes)) {
    if (typeof value === "object") {
      // First check for static route matches
      const staticMatch = matchStaticRoute(path, value as RoutePath);
      if (staticMatch) {
        return staticMatch;
      }

      // Then check for dynamic route matches
      const dynamicMatch = matchDynamicRoute(path, value as RoutePath);
      if (dynamicMatch) {
        return dynamicMatch;
      }

      // Recursive check for nested routes
      const nestedRouteInfo = findRouteInfo(path, value as RoutePath);
      if (nestedRouteInfo.currentName) {
        return nestedRouteInfo;
      }
    }
  }
  return { currentName: null, parentName: null };
};

export const getRouteInfo = (path: string): TRouteInfo => {
  if (path === routePaths.root.root)
    return {
      currentName: routePaths.root._name,
      parentName: null,
    };
  return findRouteInfo(path, routePaths.root as RoutePath);
};

export const useActivePage = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const { currentName: activeRouteName, parentName: activeRouteParentName } =
    useMemo(() => getRouteInfo(activePath), [activePath]);

  return { activeRouteName, activeRouteParentName };
};
