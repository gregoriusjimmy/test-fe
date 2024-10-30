import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { EmptyTopicSVG } from "components/assets";
import Skeleton from "components/Skeleton";
import Topic from "./Topic";

import { mutationDeleteTopic, mutationUpdateTopic } from "api/topics";
import { queryGetUserTopics } from "api/users";
import { getCookies } from "helpers/cookies";
import useAuthStore from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { TTopic } from "api/topics/types";
import { ECOOKIES_KEY } from "constants/index";

interface TopicsProps {
  searchText?: string;
}

const Topics = ({ searchText }: TopicsProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const user = useAuthStore((state) => state.user);
  const onSetTopics = useTopicStore((state) => state.onSetTopics);
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteTopic } = useMutation({
    mutationFn: mutationDeleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryGetUserTopics._key(String(user.id))],
      });
    },
  });
  const { mutate: mutateUpdateTopic } = useMutation({
    mutationFn: mutationUpdateTopic,
  });

  const { data: topics, isLoading } = useQuery(
    queryGetUserTopics._key(getCookies(ECOOKIES_KEY.USER_ID)),
    () => queryGetUserTopics({ id: getCookies(ECOOKIES_KEY.USER_ID) }),
    {
      enabled: isLogin,
      onError: () => {
        onSetTopics([]);
      },
      onSuccess: (data) => {
        onSetTopics(data);
      },
    }
  );

  const handleDelete = (topic: TTopic) => {
    mutateDeleteTopic({
      id: String(topic.id),
    });
  };

  const handleTogglePinned = (topic: TTopic) => {
    mutateUpdateTopic(
      {
        payload: { pinned: topic.pinned ? false : true },
        urlData: {
          id: String(topic.id),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [queryGetUserTopics._key(String(user.id))],
          });
        },
      }
    );
  };

  const handleRename = (topic: TTopic, newTitle: string) => {
    mutateUpdateTopic({
      payload: { title: newTitle },
      urlData: {
        id: String(topic.id),
      },
    });
  };

  const filteredTopics = useMemo(() => {
    if (!searchText) return topics;
    return (
      topics?.filter((topic) =>
        topic.title.toLowerCase().includes(searchText.toLowerCase())
      ) || []
    );
  }, [searchText, topics]);

  if (isLoading)
    return (
      <div className="flex flex-col w-full space-y-3">
        {" "}
        {[...Array(6)].map((_, index) => (
          <Skeleton className="w-full h-[2.468rem]" key={index} />
        ))}
      </div>
    );

  if (!filteredTopics?.length) {
    return (
      <div className="flex flex-col h-[70%] items-center justify-center w-full">
        <EmptyTopicSVG className="w-[10rem] h-auto" />
        <h2 className="text-foreground-300 text-lg mt-4">
          No Conversation Found
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {filteredTopics.map((topic) => (
        <Topic
          topic={topic}
          key={topic.id}
          onDelete={handleDelete}
          onTogglePinned={handleTogglePinned}
          onRename={handleRename}
        />
      ))}
    </div>
  );
};

export default Topics;
