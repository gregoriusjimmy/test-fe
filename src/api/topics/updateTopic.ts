import { TCommonMutationParam } from "..";

import { fetcher } from "lib/fetcher";

import { TUpdateTopicParam, TUpdateTopicReq, TUpdateTopicRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const updateTopic = async (
  payload: TUpdateTopicReq,
  param: TUpdateTopicParam
) => {
  return await fetcher<TUpdateTopicRes, TUpdateTopicReq, TUpdateTopicParam>(
    ENDPOINT.TOPICS.UPDATE_TOPIC,
    { data: payload, urlData: param }
  );
};

export const mutationUpdateTopic = async ({
  payload,
  urlData,
}: TCommonMutationParam<TUpdateTopicReq, TUpdateTopicParam>) => {
  return (await updateTopic(payload, urlData)).data;
};
