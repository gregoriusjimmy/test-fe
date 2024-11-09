import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useBuildVersion } from "hooks/useBuildVersion";

import router from "routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => {
  useBuildVersion();
  const queryClient = new QueryClient();

  return (
    <GoogleOAuthProvider clientId="356665215062-v7mjgvr9goqljdprci5prni8f2fob7bi.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
