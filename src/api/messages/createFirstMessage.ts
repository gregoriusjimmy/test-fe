import { fetcher } from "lib/fetcher";

import { TCreateFirstMessageReq, TCreateFirstMessageRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const createFirstMessage = async (data: TCreateFirstMessageReq) => {
  return await fetcher<TCreateFirstMessageRes, TCreateFirstMessageReq>(
    ENDPOINT.MESSAGES.CREATE_FIRST_MESSAGE,
    {
      isFormData:true,
  data 
    }
  );
};

export const mutationCreateFirstMessage = async (data: TCreateFirstMessageReq) => {
  return (await createFirstMessage(data)).data;
};

mutationCreateFirstMessage._key = [ENDPOINT.MESSAGES.CREATE_FIRST_MESSAGE];
