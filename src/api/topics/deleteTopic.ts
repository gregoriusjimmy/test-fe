import { fetcher } from "lib/fetcher";

import { TDeleteTopicParam, TDeleteTopicRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const deleteTopic = async ({ id }: TDeleteTopicParam) => {
  return await fetcher<TDeleteTopicRes, null, TDeleteTopicParam>(
    ENDPOINT.TOPICS.DELETE_TOPIC,
    {
      urlData: {
        id,
      },
    }
  );
};

export const mutationDeleteTopic = async ({ id }: TDeleteTopicParam) => {
  return (await deleteTopic({ id })).data;
};
