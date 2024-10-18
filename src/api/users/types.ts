import { TCommonApiRes } from "..";

export type TGetUserReq = {
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
