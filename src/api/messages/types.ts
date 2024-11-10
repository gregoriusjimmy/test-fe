import { TCommonApiRes } from "..";

export type TMessage = {
  id: number;
  topicId: number;
  message: string;
  file: string;
  response: string;
  responseFile: string;
  createdAt: string;
};

export type TCreateFirstMessageReq = {
  userId: string;
  aiModelId: string;
  message: string;
  files?: File[];
};

export type TCreateFirstMessageRes = TCommonApiRes<TMessage>;

export type TCreateMessageReq = {
  topicId: string;
  message: string;
  files?: File[];
};

export type TCreateMessageRes = TCommonApiRes<TMessage>;
