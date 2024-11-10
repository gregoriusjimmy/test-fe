import { create } from "zustand";

import { TTopic } from "api/topics/types";

type TTopicStore = {
  topics: TTopic[];
  selectedTopic?: TTopic;
  isLoading: boolean;
  onSetLoading: (loading: boolean) => void;
  onSetTopics: (
    topics: TTopic[] | ((prevTopics: TTopic[]) => TTopic[])
  ) => void;
  onSetSelectedTopic: (topic?: TTopic) => void;
};

const useTopicStore = create<TTopicStore>()((set) => ({
  topics: [],
  selectedTopic: undefined,
  isLoading: false,
  onSetTopics: (topics) => {
    set((state) => ({
      topics: typeof topics === "function" ? topics(state.topics) : topics,
    }));
  },
  onSetSelectedTopic: (selectedTopic) => {
    set({ selectedTopic });
  },
  onSetLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export default useTopicStore;
