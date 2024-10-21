import { fetcher } from "lib/fetcher";

import { TGetUserReq, TGetUserRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getUser = async ({id}:TGetUserReq) => {
  return await fetcher<TGetUserRes, TGetUserReq>(ENDPOINT.USERS.GET_USER,{data:{
    id
  }});
};

export const queryGetUser = async ({id}:TGetUserReq) => {
  return (await getUser({id})).data.data;
};

queryGetUser._key = (id:string)=> ENDPOINT.USERS.GET_USER.url.replace('{id}',id)
