import { TCommonApiRes } from "..";

export type TTopic = {
  id: number;
  userId: number;
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
