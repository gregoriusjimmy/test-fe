import { create } from "zustand";

import { TAIModel } from "api/ai-models/types";

type TAIModelStore = {
  aiModels: TAIModel[];
  selectedAIModel: TAIModel | null;
  onSetAIModels: (aiModels: TAIModel[]) => void;
  onSetSelectedAIModel: (aiModel: TAIModel | null) => void;
  onSetSelectedAIModelById: (aiModelId: number) => void;
};

const useAIModelStore = create<TAIModelStore>()((set, get) => ({
  aiModels: [],
  selectedAIModel: null,
  onSetAIModels: (aiModels) => {
    set({ aiModels });
  },
  onSetSelectedAIModel: (aiModel) => {
    set({ selectedAIModel: aiModel });
  },
  onSetSelectedAIModelById: (id: number) => {
    const { aiModels } = get();
    const selected = aiModels.find((model) => model.id === id);
    set({ selectedAIModel: selected });
  },
}));

export default useAIModelStore;
