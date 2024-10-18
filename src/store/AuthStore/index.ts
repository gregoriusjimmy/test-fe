import { create } from "zustand";

import { TUser } from "api/users/types";

export const INIT_USER: TUser = {
  id: 0,
  email: "",
  role: "",
  authType: "",
  subscriptionActive: false,
  subscriptionStartDate: "",
  subscriptionExpiredDate: "",
  createdAt: "",
};

type TAuthStore = {
  isLogin: boolean;
  loading: boolean;
  user: TUser;
  onSetLoading: (loading: boolean) => void;
  onSetUser: (user: TUser) => void;
  onSetIsLogin: (isLogin: boolean) => void;
};

const useAuthStore = create<TAuthStore>()((set) => ({
  isLogin: false,
  loading: false,
  user: INIT_USER,
  onSetLoading: (loading) => {
    set({ loading });
  },
  onSetUser: (user) => {
    set({ user });
  },
  onSetIsLogin: (isLogin) => {
    set({ isLogin });
  },
}));

export default useAuthStore;

// const useWorkspaceStore = create<TWorkspaceStore>()(
//   persist(
//     (set) => ({
//       workspaceList: [],
//       selectedWorkspace: null,
//       lastSavedWorkspace: null,
//       onSetWorkspaceList: (workspaceList: TWorkspace[]) => {
//         set({ workspaceList });
//       },
//       onSetSelectedWorkspace: (selectedWorkspace: TWorkspace | null) => {
//         set({ selectedWorkspace });
//       },
//       onSetLastSavedWorkspace: (lastSavedWorkspace: TWorkspace) => {
//         set({ lastSavedWorkspace });
//       },
//     }),
//     {
//       name: "workspace-storage",
//       partialize: (state) => ({
//         lastSavedWorkspace: state.lastSavedWorkspace,
//       }),
//     }
//   )
// );

// export default useWorkspaceStore;
