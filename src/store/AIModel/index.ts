import { create } from "zustand";

import { TAIModel } from "api/ai-models/types";

type TAIModelStore = {
  aiModels: TAIModel[];
  selectedAIModel: TAIModel | null;
  onSetAIModels: (aiModels: TAIModel[]) => void;
  onSetSelectedAIModel: (aiModel: TAIModel | null) => void;
};

const useAIModelStore = create<TAIModelStore>()((set) => ({
  aiModels: [],
  selectedAIModel: null,
  onSetAIModels: (aiModels) => {
    set({ aiModels });
  },
  onSetSelectedAIModel: (aiModel) => {
    set({ selectedAIModel: aiModel });
  },
}));

export default useAIModelStore;
