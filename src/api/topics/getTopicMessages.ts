import { fetcher } from "lib/fetcher";

import { TGetTopicMessagesParam, TGetTopicMessagesRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getTopicMessages = async (param: TGetTopicMessagesParam) => {
  return await fetcher<TGetTopicMessagesRes, null, TGetTopicMessagesParam>(
    ENDPOINT.TOPICS.GET_TOPIC_MESSAGES,
    { urlData: param }
  );
};

export const queryGetTopicMessages = async (
  urlData: TGetTopicMessagesParam
) => {
  return (await getTopicMessages(urlData)).data;
};

queryGetTopicMessages._key = (topicId: TGetTopicMessagesParam["topicId"]) => [
  ENDPOINT.TOPICS.GET_TOPIC_MESSAGES.url.replace("{topicId}", topicId),
];
