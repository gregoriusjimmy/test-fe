import { TCommonApiRes } from "..";

import { TTopic } from "api/topics/types";

export type TGetUserParam = {
  id: string;
};

export type TGetUserRes = TCommonApiRes<TUser>;

export type TUser = {
  id: number;
  email: string;
  role: string;
  authType: string;
  subscriptionActive: boolean;
  subscriptionStartDate: string;
  subscriptionExpiredDate: string;
  createdAt: string;
};

export type TGetUserTopicsParam = {
  id: string;
};

export type TGetUserTopicsRes = TCommonApiRes<TTopic[]>;
