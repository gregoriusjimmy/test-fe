import { fetcher } from "lib/fetcher";

import { TGetUserTopicsParam, TGetUserTopicsRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getUserTopics = async ({ id }: TGetUserTopicsParam) => {
  return await fetcher<TGetUserTopicsRes, null, TGetUserTopicsParam>(
    ENDPOINT.USERS.GET_USER_TOPICS,
    {
      urlData: {
        id,
      },
    }
  );
};

export const queryGetUserTopics = async ({ id }: TGetUserTopicsParam) => {
  return (await getUserTopics({ id })).data.data;
};

queryGetUserTopics._key = (id: string) => [
  ENDPOINT.USERS.GET_USER_TOPICS.url.replace("{id}", id),
];
