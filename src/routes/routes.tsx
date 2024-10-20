import { Navigate } from "react-router-dom";

import App from "pages/App";
import Login from "pages/Login";

import { RouteType } from "types";
import { routePaths } from "./constants";

export const routes: RouteType[] = [
  {
    path: routePaths.root.root,
    element: <App />,
    // requiredAuth: true,
    withoutLayout:false,
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
