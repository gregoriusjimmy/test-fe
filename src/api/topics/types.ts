import { TCommonApiRes } from "..";

import { TMessage } from "api/messages/types";

export type TTopic = {
  id: number;
  userId: number;
  aiModelId: number;
  title: string;
  pinned: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type TDeleteTopicParam = {
  id: string;
};

export type TDeleteTopicRes = TCommonApiRes;

export type TUpdateTopicParam = {
  id: string;
};

export type TUpdateTopicReq = {
  userId?: string;
  title?: string;
  pinned?: boolean;
};

export type TUpdateTopicRes = TCommonApiRes<TTopic>;

export type TGetTopicMessagesParam = {
  topicId: string;
};

export type TGetTopicMessagesRes = TCommonApiRes<TMessage[]>;
