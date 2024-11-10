import { fetcher } from "lib/fetcher";

import { TCreateMessageReq, TCreateMessageRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const createMessage = async (data: TCreateMessageReq) => {
  return await fetcher<TCreateMessageRes, TCreateMessageReq>(
    ENDPOINT.MESSAGES.CREATE_MESSAGE,
    {
      isFormData: true,
      data,
    }
  );
};

export const mutationCreateMessage = async (data: TCreateMessageReq) => {
  return (await createMessage(data)).data;
};

mutationCreateMessage._key = [ENDPOINT.MESSAGES.CREATE_MESSAGE];
