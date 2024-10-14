import { Navigate } from "react-router-dom";

import App from "pages/App";

import { RouteType } from "types";
import { routePaths } from "./constants";

export const routes: RouteType[] = [
  {
    path: routePaths.root.root,
    element: <App />,
  },
  {
    path: "*",
    element: <Navigate to={routePaths.root.root} />,
    withoutLayout: true,
  },
];
