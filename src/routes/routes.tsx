import { Navigate } from "react-router-dom";

import Chat from "pages/Chat";
import Login from "pages/Login";

import { RouteType } from "types";
import { routePaths } from "./constants";

export const routes: RouteType[] = [
  {
    path: routePaths.root.root,
    element: <Chat />,
    requiredAuth: true,
    withoutLayout: false,
  },
  {
    path: routePaths.root.topic.root,
    element: <Chat />,
    requiredAuth: true,
    withoutLayout: false,
  },
  {
    path: routePaths.root.login.root,
    element: <Login />,
    withoutLayout: true,
  },
  {
    path: "*",
    element: <Navigate to={routePaths.root.root} />,
    withoutLayout: true,
  },
];
