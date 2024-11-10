import { fetcher } from "lib/fetcher";

import { TGetUserParam, TGetUserRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getUser = async ({ id }: TGetUserParam) => {
  return await fetcher<TGetUserRes, null, TGetUserParam>(
    ENDPOINT.USERS.GET_USER,
    {
      urlData: {
        id,
      },
    }
  );
};

export const queryGetUser = async ({ id }: TGetUserParam) => {
  return (await getUser({ id })).data.data;
};

queryGetUser._key = (id: string) => [
  ENDPOINT.USERS.GET_USER.url.replace("{id}", id),
];
