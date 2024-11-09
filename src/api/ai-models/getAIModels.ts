import { fetcher } from "lib/fetcher";

import { TGetAIModelsRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getAIModels = async () => {
  return await fetcher<TGetAIModelsRes, null>(ENDPOINT.AI_MODELS.GET_AI_MODELS);
};

export const queryGetAIModels = async () => {
  return (await getAIModels()).data.data;
};

queryGetAIModels._key = [ENDPOINT.AI_MODELS.GET_AI_MODELS.url];
