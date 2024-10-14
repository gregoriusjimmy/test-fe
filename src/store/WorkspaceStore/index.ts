import { create } from "zustand";
import { persist } from "zustand/middleware";

import { TWorkspace } from "api/chat/types";

type TWorkspaceStore = {
  workspaceList: TWorkspace[];
  selectedWorkspace: TWorkspace | null;
  lastSavedWorkspace: TWorkspace | null;
  onSetWorkspaceList: (workspaceList: TWorkspace[]) => void;
  onSetSelectedWorkspace: (selectedWorkspace: TWorkspace | null) => void;
  onSetLastSavedWorkspace: (lastSavedWorkspace: TWorkspace) => void;
};

const useWorkspaceStore = create<TWorkspaceStore>()(
  persist(
    (set) => ({
      workspaceList: [],
      selectedWorkspace: null,
      lastSavedWorkspace: null,
      onSetWorkspaceList: (workspaceList: TWorkspace[]) => {
        set({ workspaceList });
      },
      onSetSelectedWorkspace: (selectedWorkspace: TWorkspace | null) => {
        set({ selectedWorkspace });
      },
      onSetLastSavedWorkspace: (lastSavedWorkspace: TWorkspace) => {
        set({ lastSavedWorkspace });
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        lastSavedWorkspace: state.lastSavedWorkspace,
      }),
    }
  )
);

export default useWorkspaceStore;
