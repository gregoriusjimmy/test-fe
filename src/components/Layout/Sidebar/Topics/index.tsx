import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { EmptyTopicSVG } from "components/assets";
import Topic from "./Topic";

import { mutationDeleteTopic, mutationUpdateTopic } from "api/topics";
import { queryGetUserTopics } from "api/users";
import useAuthStore from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { TTopic } from "api/topics/types";

interface TopicsProps {
  searchText?: string;
}

interface TGroupedTopics {
  label: string;
  data: TTopic[];
}

const Topics = ({ searchText }: TopicsProps) => {
  const user = useAuthStore((state) => state.user);
  const topics = useTopicStore((state) => state.topics);
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteTopic } = useMutation({
    mutationFn: mutationDeleteTopic,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryGetUserTopics._key(String(user.id)),
      });
    },
  });

  const { mutate: mutateUpdateTopic } = useMutation({
    mutationFn: mutationUpdateTopic,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryGetUserTopics._key(String(user.id)),
      });
    },
  });

  const handleDelete = (topic: TTopic) => {
    const previousTopics = queryClient.getQueryData<TTopic[]>(
      queryGetUserTopics._key(String(user.id))
    );

    queryClient.setQueryData<TTopic[]>(
      queryGetUserTopics._key(String(user.id)),
      (oldTopics) => {
        if (!oldTopics) return [];
        return oldTopics.filter((t) => t.id !== topic.id); // Remove the topic
      }
    );

    mutateDeleteTopic(
      {
        id: String(topic.id),
      },
      {
        onError: () => {
          queryClient.setQueryData(
            queryGetUserTopics._key(String(user.id)),
            previousTopics
          );
        },
      }
    );
  };

  const handleTogglePinned = (topic: TTopic) => {
    const cacheKey = queryGetUserTopics._key(String(user.id));
    const previousTopics = queryClient.getQueryData<TTopic[]>(cacheKey) ?? []; // Fallback to empty array if undefined

    // Toggle the pinned state of the topic and update the timestamp
    const updatedTopic = {
      ...topic,
      pinned: !topic.pinned,
      updatedAt: dayjs().toISOString(),
    };

    // Remove the selected topic from the list
    const remainingTopics = previousTopics.filter((t) => t.id !== topic.id);

    // If the topic is pinned, move it to the first position
    if (updatedTopic.pinned) {
      remainingTopics.unshift(updatedTopic);
    } else {
      // Find the last pinned index and insert the topic after it
      const lastPinnedIndex = remainingTopics.reduce(
        (index, t, i) => (t.pinned ? i : index),
        -1
      );
      remainingTopics.splice(
        lastPinnedIndex === -1 ? 0 : lastPinnedIndex + 1,
        0,
        updatedTopic
      );
    }

    // Optimistically update the cache with the modified order
    queryClient.setQueryData<TTopic[]>(cacheKey, remainingTopics);

    // Mutate the topic update
    mutateUpdateTopic(
      {
        payload: { pinned: updatedTopic.pinned },
        urlData: { id: String(topic.id) },
      },
      {
        onError: () => {
          // Revert cache in case of an error
          queryClient.setQueryData(cacheKey, previousTopics);
        },
      }
    );
  };

  const handleRename = (topic: TTopic, newTitle: string) => {
    const cacheKey = queryGetUserTopics._key(String(user.id));
    const previousTopics = queryClient.getQueryData<TTopic[]>(cacheKey) ?? []; // Fallback to empty array if undefined

    // Remove the selected topic from the list
    const remainingTopics = previousTopics.filter((t) => t.id !== topic.id);
    const updatedTopic = {
      ...topic,
      title: newTitle,
      updatedAt: dayjs().toISOString(),
    };

    // If the topic is pinned, move it to the first position
    if (updatedTopic.pinned) {
      remainingTopics.unshift(updatedTopic);
    } else {
      // Find the last pinned index and insert after it
      const lastPinnedIndex = remainingTopics.reduce(
        (index, t, i) => (t.pinned ? i : index),
        -1
      );
      remainingTopics.splice(
        lastPinnedIndex === -1 ? 0 : lastPinnedIndex + 1,
        0,
        updatedTopic
      );
    }

    // Optimistically update the cache with the modified order
    queryClient.setQueryData<TTopic[]>(cacheKey, remainingTopics);

    // Mutate the topic update
    mutateUpdateTopic(
      {
        payload: { title: newTitle },
        urlData: { id: String(topic.id) },
      },
      {
        onError: () => {
          // Revert cache in case of an error
          queryClient.setQueryData(cacheKey, previousTopics);
        },
      }
    );
  };

  const filteredTopics = useMemo(() => {
    if (!searchText) return topics;
    return (
      topics?.filter((topic) =>
        topic.title.toLowerCase().includes(searchText.toLowerCase())
      ) || []
    );
  }, [searchText, topics]);

  const groupedData = useMemo((): TGroupedTopics[] => {
    if (!filteredTopics?.length) return [];
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");
    const sevenDaysAgo = dayjs().subtract(7, "day");
    const thirtyDaysAgo = dayjs().subtract(30, "day");

    const groups: TGroupedTopics[] = [
      { label: "Today", data: [] },
      { label: "Yesterday", data: [] },
      { label: "Previous 7 Days", data: [] },
      { label: "Previous 30 Days", data: [] },
    ];

    filteredTopics.forEach((item) => {
      const updatedAt = dayjs(item.updatedAt);

      if (updatedAt.isSame(today, "day")) {
        groups[0].data.push(item);
      } else if (updatedAt.isSame(yesterday, "day")) {
        groups[1].data.push(item);
      } else if (updatedAt.isAfter(sevenDaysAgo) && updatedAt.isBefore(today)) {
        groups[2].data.push(item);
      } else if (
        updatedAt.isAfter(thirtyDaysAgo) &&
        updatedAt.isBefore(sevenDaysAgo)
      ) {
        groups[3].data.push(item);
      }
    });

    return groups.filter((group) => group.data.length > 0);
  }, [filteredTopics]);

  // if (isLoading)
  //   return (
  //     <div className="flex flex-col w-full space-y-3">
  //       {" "}
  //       {[...Array(6)].map((_, index) => (
  //         <Skeleton className="w-full h-[2.468rem]" key={index} />
  //       ))}
  //     </div>
  //   );

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
    <div className="flex flex-col space-y-4">
      {groupedData.map((group, idx) => (
        <div className="flex flex-col" key={idx}>
          <div className="text-foreground-400 font-semibold mb-4">
            {group.label}
          </div>
          {group.data.map((topic) => (
            <Topic
              topic={topic}
              key={topic.id}
              onDelete={handleDelete}
              onTogglePinned={handleTogglePinned}
              onRename={handleRename}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Topics;
