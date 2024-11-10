import { createBrowserRouter, Outlet } from "react-router-dom";

import AppContainer from "components/AppContainer";
import AuthRoute from "components/AuthRoute";
import Layout from "components/Layout";
import LayoutRoute from "components/LayoutRoute";
import TopicRoute from "components/TopicRoute";
import { routes } from "./routes";

const MainElement = () => {
  return (
    <AppContainer>
      <Layout>
        <Outlet />
      </Layout>
    </AppContainer>
  );
};

const router = createBrowserRouter([
  {
    element: <MainElement />,
    children: routes.map((route) => ({
      path: route.path,
      element: (
        <LayoutRoute route={route}>
          <AuthRoute route={route}>
            <TopicRoute route={route}>{route.element}</TopicRoute>
          </AuthRoute>
        </LayoutRoute>
      ),
    })),
  },
]);

export default router;
