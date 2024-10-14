import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum EUI {
  EXPERT = "EXPERT",
  SIMPLE = "SIMPLE",
}

type TUIStore = {
  ui: EUI;
  onSetUI: (type: EUI) => void;
};

const useUIStore = create<TUIStore>()(
  persist(
    (set) => ({
      ui: EUI.EXPERT,
      onSetUI: (ui: EUI) => set({ ui }),
    }),
    {
      name: "ui-storage",
    }
  )
);

export default useUIStore;
