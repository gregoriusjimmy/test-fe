import { create } from "zustand";

type TLayoutStore = {
  showBaseLayout: boolean;
  onSetShowBaseLayout: (show: boolean) => void;
};

const useLayoutStore = create<TLayoutStore>((set) => ({
  showBaseLayout: true,
  onSetShowBaseLayout: (show: boolean) => {
    set({ showBaseLayout: show });
  },
}));

export default useLayoutStore;
