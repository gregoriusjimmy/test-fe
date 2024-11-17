import { create } from "zustand";

type TLayoutStore = {
  showBaseLayout: boolean;
  sidebarOpen: boolean;
  onSetSidebarOpen: (open: boolean) => void;
  onSetShowBaseLayout: (show: boolean) => void;
};

const useLayoutStore = create<TLayoutStore>((set) => ({
  showBaseLayout: true,
  sidebarOpen: true,
  onSetShowBaseLayout: (show: boolean) => {
    set({ showBaseLayout: show });
  },
  onSetSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
}));

export default useLayoutStore;
