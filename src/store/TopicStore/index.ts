import { create } from "zustand";

import { TTopic } from "api/topics/types";

type TTopicStore = {
  topics: TTopic[];
  onSetTopics: (topics: TTopic[]) => void;
};

const useTopicStore = create<TTopicStore>()((set) => ({
  topics: [],
  onSetTopics: (topics) => {
    set({ topics });
  },
}));

export default useTopicStore;
