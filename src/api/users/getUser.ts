import { fetcher } from "lib/fetcher";

import { TGetUserReq, TGetUserRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getUser = async () => {
  return await fetcher<TGetUserRes, TGetUserReq>(ENDPOINT.USERS.GET_USER);
};

export const queryGetUser = async () => {
  return (await getUser()).data.data;
};

queryGetUser._key = ENDPOINT.USERS.GET_USER.url;
