import { create } from "zustand";

import { TTopic } from "api/topics/types";

type TTopicStore = {
  topics: TTopic[];
  selectedTopic?:TTopic
  isLoading:boolean
  onSetLoading:(loading:boolean)=>void
  onSetTopics: (topics: TTopic[]) => void;

  onSetSelectedTopic: (topic?: TTopic) => void;
};

const useTopicStore = create<TTopicStore>()((set) => ({
  topics: [],
  selectedTopic:undefined,
  isLoading:false,
  onSetTopics: (topics) => {
    set({ topics });
  },
  onSetSelectedTopic: (selectedTopic) => {
    set({ selectedTopic });
  },
  onSetLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export default useTopicStore;
