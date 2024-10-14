import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";

import { useBuildVersion } from "hooks/useBuildVersion";

import router from "routes";

const App = () => {
  useBuildVersion();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />{" "}
    </QueryClientProvider>
  );
};

export default App;
